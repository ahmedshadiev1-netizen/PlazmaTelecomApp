import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ApiService from '../services/ApiService';

interface PeriodicService {
  id: string;
  vgid: string;
  description: string;
  quantity: number;
  price: number;
  total_cost: number;
  category: string;
  tariff_id: string;
  first_on: string;
  comment: string | null;
  status?: string;
}

interface PeriodicServicesModalProps {
  visible: boolean;
  onClose: () => void;
  accountId: string;
}

const PeriodicServicesModal: React.FC<PeriodicServicesModalProps> = ({
  visible,
  onClose,
  accountId,
}) => {
  const [services, setServices] = useState<PeriodicService[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && accountId) {
      loadPeriodicServices();
    }
  }, [visible, accountId]);

  const loadPeriodicServices = async () => {
    try {
      setLoading(true);
      const apiService = ApiService.getInstance();
      const services = await apiService.getAccountPeriodicServices(accountId);
      setServices(services);
    } catch (error) {
      console.error('Failed to load periodic services:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить периодические услуги');
    } finally {
      setLoading(false);
    }
  };

  const isServiceActive = (service: PeriodicService) => {
    if (service.status) {
      const normalized = service.status.toString().toLowerCase();
      return ['active', 'enabled', '1', 'включена'].includes(normalized);
    }
    return service.total_cost > 0 && service.quantity > 0;
  };

  const getStatusColor = (service: PeriodicService) => {
    return isServiceActive(service) ? '#2E7D32' : '#D32F2F';
  };

  const getStatusText = (service: PeriodicService) => {
    if (isServiceActive(service)) {
      return 'Включена, тарифицируется';
    }
    return 'Отключена';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Периодические услуги</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loadingText}>Загрузка услуг...</Text>
          </View>
        ) : (
          <ScrollView style={styles.content}>
            {services.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Icon name="info-outline" size={48} color="#999" />
                <Text style={styles.emptyText}>Периодические услуги не найдены</Text>
              </View>
            ) : (
              services.map((service) => (
                <View key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <Text style={styles.serviceDescription}>
                      {service.description}
                    </Text>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(service) }
                    ]}>
                      <Text style={styles.statusText}>
                        {getStatusText(service)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.serviceDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Количество:</Text>
                      <Text style={styles.detailValue}>
                        {service.quantity}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Цена:</Text>
                      <Text style={styles.detailValue}>
                        {service.price.toFixed(2)} ₽
                      </Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Итоговая стоимость:</Text>
                      <Text style={[styles.detailValue, styles.totalCost]}>
                        {service.total_cost.toFixed(2)} ₽
                      </Text>
                    </View>
                    
                    {service.category && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Категория:</Text>
                        <Text style={styles.detailValue}>{service.category}</Text>
                      </View>
                    )}

                    {service.first_on && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Дата подключения:</Text>
                        <Text style={styles.detailValue}>{service.first_on}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  serviceDescription: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginRight: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  serviceDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  totalCost: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
});

export default PeriodicServicesModal;
