import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { format, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

const PurchaseLogs = () => {
  const [expandedMonths, setExpandedMonths] = useState({});
  const [expandedDays, setExpandedDays] = useState({});

  const {} = useQuery({
    queryKey: [""]
  })

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({ ...prev, [month]: !prev[month] }));
  };

  const toggleDay = (day) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const renderPurchaseItem = (item, index) => (
    <View style={styles.purchaseItem} key={index}>
      <View style={styles.purchaseDetails}>
        <Text style={styles.productName}>{item.productId.name}</Text>
        <Text style={styles.productNumber}>#{item.productId.productNumber}</Text>
      </View>
      <View style={styles.priceDetails}>
        <Text style={styles.productPrice}>Rs. {item.productId.price * item.quantity}</Text>
        <Text style={styles.productQuantity}>Qty: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paid Products</Text>
      <FlatList
        data={Object.entries(groupedPurchases)}
        keyExtractor={(item) => item[0]}
        renderItem={({ item: [month, days] }) => (
          <View style={styles.monthSection}>
            <TouchableOpacity
              onPress={() => toggleMonth(month)}
              style={styles.monthHeader}
            >
              <Text style={styles.monthTitle}>{format(parseISO(`${month}-01`), 'MMMM yyyy')}</Text>
              {expandedMonths[month] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </TouchableOpacity>
            {expandedMonths[month] &&
              Object.entries(days).map(([day, purchases]) => (
                <View key={day} style={styles.daySection}>
                  <TouchableOpacity
                    onPress={() => toggleDay(day)}
                    style={styles.dayHeader}
                  >
                    <Text style={styles.dayTitle}>{format(parseISO(day), 'EEEE, MMMM d')}</Text>
                    {expandedDays[day] ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </TouchableOpacity>
                  {expandedDays[day] &&
                    purchases.map((purchase, purchaseIndex) => (
                      <View key={purchaseIndex} style={styles.purchaseContainer}>
                        <Text style={styles.purchaseTime}>
                          Purchase at {format(parseISO(purchase[0].updatedAt), 'HH:mm:ss')}
                        </Text>
                        {purchase.map(renderPurchaseItem)}
                        <Text style={styles.total} key={renderPurchaseItem}>
                          Total: Rs.{' '}
                          {purchase.reduce((sum, item) => sum + item.productId.price * item.quantity, 0).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                </View>
              ))}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1f2937',
  },
  monthSection: {
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  daySection: {
    marginLeft: 16,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  purchaseContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  purchaseTime: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#6b7280',
  },
  purchaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
    marginBottom: 8,
  },
  purchaseDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  productNumber: {
    fontSize: 12,
    color: '#6b7280',
  },
  priceDetails: {
    alignItems: 'flex-end',
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  productQuantity: {
    fontSize: 12,
    color: '#6b7280',
  },
  total: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
  },
});

export default PurchaseLogs;
