import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { differenceInSeconds, format, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronDown, ChevronRight, Eraser } from 'lucide-react-native';
import { getPaidCartsByMachine } from '../../api';

const PurchaseLogs = () => {
  const { id } = useLocalSearchParams();
  const { data: paid_carts, isLoading, error } = useQuery({
    queryKey: ['paid_carts', id],
    queryFn: async () => {
      const response = await getPaidCartsByMachine(id);
      return response.data.data;
    },
    initialData: [],
  });

  const router = useRouter();
  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedDays, setExpandedDays] = useState({});

  const groupedPurchases = useMemo(() => {
    const sorted = [...paid_carts].sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return sorted.reduce((acc, item) => {
      const date = parseISO(item.updatedAt);
      const monthKey = format(date, 'yyyy-MM');
      const dayKey = format(date, 'yyyy-MM-dd');

      if (!acc[monthKey]) {
        acc[monthKey] = {};
      }
      if (!acc[monthKey][dayKey]) {
        acc[monthKey][dayKey] = [];
      }

      const lastPurchase = acc[monthKey][dayKey][acc[monthKey][dayKey].length - 1];
      if (!lastPurchase || differenceInSeconds(parseISO(lastPurchase[0].updatedAt), date) > 1) {
        acc[monthKey][dayKey].push([item]);
      } else {
        lastPurchase.push(item);
      }

      return acc;
    }, {});
  }, [paid_carts]);

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  if (isLoading) return <Loader  />;  
  if (error) return <Eraser />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Paid Products</Text>
        <TouchableOpacity
          onPress={() => router.push(`/admin/carts/printDetails/${id}`)}
          style={styles.printButton}
        >
          <Text style={styles.printText}>Print</Text>
        </TouchableOpacity>
      </View>

       {groupedPurchases && <FlatList
        data={Object.entries(groupedPurchases)}
        keyExtractor={([month]) => month}
        renderItem={({ item: [month, days] }) => (
          <View style={styles.section}>
            <TouchableOpacity onPress={() => toggleMonth(month)} style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{format(parseISO(`${month}-01`), 'MMMM yyyy')}</Text>
              {expandedMonths[month] ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
            </TouchableOpacity>

            {expandedMonths[month] &&
              Object.entries(days).map(([day, purchases]) => (
                <View key={day} style={styles.daySection}>
                  <TouchableOpacity onPress={() => toggleDay(day)} style={styles.dayHeader}>
                    <Text style={styles.dayTitle}>{format(parseISO(day), 'EEEE, MMMM d')}</Text>
                    {expandedDays[day] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </TouchableOpacity>

                  {expandedDays[day] && (
                    <FlatList
                      data={purchases}
                      keyExtractor={(purchase, index) => `purchase-${day}-${index}`}
                      renderItem={({ item: purchase }) => (
                        <View style={styles.purchaseItem}>
                          <Text style={styles.purchaseTime}>
                            Purchase at {format(parseISO(purchase[0].updatedAt), 'HH:mm:ss')}
                          </Text>
                          <FlatList
                            data={purchase}
                            keyExtractor={(item) => item._id}
                            renderItem={({ item }) => (
                              <View style={styles.productItem}>
                                <View>
                                  <Text style={styles.productName}>{item?.productId?.name}</Text>
                                  <Text style={styles.productNumber}>#{item?.productId?.productNumber}</Text>
                                </View>
                                <View style={styles.productPriceContainer}>
                                  <Text style={styles.productPrice}>Rs. {item?.productId?.price * item?.quantity}</Text>
                                  <Text style={styles.productQuantity}>Qty: {item?.quantity}</Text>
                                </View>
                              </View>
                            )}
                          />
                          <Text style={styles.totalAmount}>
                            Total: Rs.{' '}
                            {purchase.reduce(
                              (sum, item) => sum + item?.productId?.price * item.quantity,
                              0
                            ).toFixed(2)}
                          </Text>
                        </View>
                      )}
                    />
                  )}
                </View>
              ))}
          </View>
        )}
      />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  printButton: {
    backgroundColor: '#000',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  printText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  daySection: {
    paddingLeft: 10,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  purchaseItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 10,
    marginVertical: 4,
  },
  purchaseTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 4,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  productNumber: {
    fontSize: 12,
    color: '#777',
  },
  productPriceContainer: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  productQuantity: {
    fontSize: 12,
    color: '#777',
  },
  totalAmount: {
    textAlign: 'right',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
});

export default PurchaseLogs;
