import React, { useCallback, useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { PagerView } from 'react-native-pager-view';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PeriodicServicesModal from './src/components/PeriodicServicesModal';
import ApiService from './src/services/ApiService';
import NotificationService from './src/services/NotificationService';
import LoginModal from './src/components/LoginModal';
import AmountPromptModal from './src/components/AmountPromptModal';

interface Contract {
  id: string;
  number: string;
  balance: number;
  status: string;
  accounts_count: number;
}

interface Account {
  id: string;
  contract_id: string;
  tariff_name: string;
  status: string;
  balance: number;
  service_rent: number;
  current_shape: number;
  agent_type: string;
}

interface User {
  name: string;
  contracts: Contract[];
  accounts: Account[];
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentContractIndex, setCurrentContractIndex] = useState(0);
  const [currentAccountIndex, setCurrentAccountIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [periodicServicesVisible, setPeriodicServicesVisible] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authInProgress, setAuthInProgress] = useState(false);
  const [promiseModalVisible, setPromiseModalVisible] = useState(false);
  const [promiseError, setPromiseError] = useState<string | null>(null);
  const [activeContractId, setActiveContractId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    checkAuth();
    initializeNotifications();
  }, []);

  const initializeNotifications = () => {
    const notificationService = NotificationService.getInstance();
    notificationService.initialize();
  };

  const checkAuth = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('auth_token');
      if (storedToken) {
        setToken(storedToken);
        await loadUserData(storedToken);
      } else {
        setLoginVisible(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setLoginVisible(true);
    }
  };

  const handleLoginSubmit = async (login: string, password: string) => {
    if (!login || !password) {
      setLoginError('Введите логин и пароль');
      return;
    }

    try {
      setAuthInProgress(true);
      setLoginError(null);
      const apiService = ApiService.getInstance();
      await apiService.setBaseUrl(apiService.getBaseUrl(), false);
      const response = await apiService.login(login.trim(), password.trim());

      setToken(response.access_token);
      setLoginVisible(false);
      await loadUserData(response.access_token);
    } catch (error) {
      console.error('Login failed', error);
      setLoginError('Не удалось войти. Проверьте данные и повторите попытку');
    } finally {
      setAuthInProgress(false);
    }
  };

  const handleLogout = async () => {
    try {
      const apiService = ApiService.getInstance();
      await apiService.logout();
    } catch (error) {
      console.warn('Failed to clear auth token on logout', error);
    }
    setToken(null);
    setUser(null);
    setLoginVisible(true);
  };

  const loadUserData = async (authToken: string, silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      
      const apiService = ApiService.getInstance();
      
      // Load contracts and accounts in parallel
      const [contracts, accounts] = await Promise.all([
        apiService.getContracts(),
        apiService.getAccounts()
      ]);

      const storedName = await AsyncStorage.getItem('user_display_name');
      const resolvedName =
        (contracts?.[0] as any)?.client_name ||
        storedName ||
        'Абонент Плазмателеком';

      setUser({
        name: resolvedName,
        contracts,
        accounts
      });

      await AsyncStorage.setItem('user_display_name', resolvedName);
    } catch (error) {
      console.error('Failed to load user data:', error);
      Alert.alert('Ошибка', 'Не удалось загрузить данные');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const getCurrentContract = () => {
    if (!user || !user.contracts.length) return null;
    return user.contracts[currentContractIndex];
  };

  const getCurrentAccounts = () => {
    const contract = getCurrentContract();
    if (!contract || !user) return [];
    
    return user.accounts.filter(account => account.contract_id === contract.id);
  };

  const getCurrentAccount = () => {
    const accounts = getCurrentAccounts();
    if (!accounts.length) return null;
    return accounts[currentAccountIndex];
  };

  const handlePromisePayment = async () => {
    const contract = getCurrentContract();
    if (!contract || !token) return;
    setActiveContractId(contract.id);
    setPromiseModalVisible(true);
    setPromiseError(null);
  };

  const processPromisePayment = async (contractId: string, amount: number) => {
    try {
      const apiService = ApiService.getInstance();
      await apiService.activatePromisePayment(contractId, {
        amount,
        description: 'Пополнение баланса через мобильное приложение'
      });

      Alert.alert('Успех', 'Обещанный платеж активирован');
      await loadUserData(token!);
      setPromiseModalVisible(false);
    } catch (error: any) {
      console.error('Promise payment failed', error);
      setPromiseError('Не удалось активировать платеж. Попробуйте позже.');
    }
  };

  const onRefresh = useCallback(async () => {
    if (!token) {
      return;
    }
    setRefreshing(true);
    await loadUserData(token, true);
    setRefreshing(false);
  }, [token]);

  const showPeriodicServices = (accountId: string) => {
    setSelectedAccountId(accountId);
    setPeriodicServicesVisible(true);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Загрузка...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginContainer}>
          <Text style={styles.loginTitle}>Плазмателеком</Text>
          <TouchableOpacity style={styles.loginButton} onPress={() => setLoginVisible(true)}>
            <Text style={styles.loginButtonText}>Войти в систему</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const contract = getCurrentContract();
  const accounts = getCurrentAccounts();
  const currentAccount = getCurrentAccount();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ЛИЧНЫЙ КАБИНЕТ</Text>
        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
          <Icon name="arrow-forward" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* User Info */}
        <View style={styles.userCard}>
          <Text style={styles.userName}>{user.name}</Text>
          
          {contract && (
            <>
              <Text style={styles.contractNumber}>Договор № {contract.number}</Text>
              <Text style={styles.contractDate}>Дата: 2019-06-11</Text>
              
              <View style={styles.balanceContainer}>
                <Text style={styles.balanceAmount}>{contract.balance.toFixed(2)} ₽</Text>
                <TouchableOpacity style={styles.balanceButton}>
                  <Icon name="add" size={20} color="#2E7D32" />
                </TouchableOpacity>
              </View>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>История списаний и...</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handlePromisePayment}>
                  <Text style={styles.actionButtonText}>Доверительный платёж</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Text style={styles.actionButtonText}>Способы оплаты</Text>
                </TouchableOpacity>
              </View>

              {/* Contract Pagination */}
              {user.contracts.length > 1 && (
                <View style={styles.pagination}>
                  {user.contracts.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.paginationDot,
                        index === currentContractIndex && styles.paginationDotActive
                      ]}
                    />
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Accounts Section */}
        {accounts.length > 0 && (
          <View style={styles.accountsSection}>
            <PagerView
              style={styles.accountsPager}
              initialPage={0}
              onPageSelected={(e) => setCurrentAccountIndex(e.nativeEvent.position)}
            >
              {accounts.map((account, index) => (
                <View key={account.id} style={styles.accountCard}>
                  <View style={styles.accountHeader}>
                    <Text style={styles.accountTitle}>
                      {account.agent_type === 'radius' ? 'Интернет' : 
                       account.agent_type === 'TVIP' ? 'Телевидение' : 
                       'Видеонаблюдение'}
                    </Text>
                  </View>

                  <View style={styles.accountContent}>
                    {account.agent_type === 'radius' && (
                      <>
                        <View style={styles.accountField}>
                          <Text style={styles.fieldLabel}>Логин:</Text>
                          <Text style={styles.fieldValue}>{account.id}</Text>
                        </View>
                        <View style={styles.accountField}>
                          <Text style={styles.fieldLabel}>Статус:</Text>
                          <Text style={[styles.fieldValue, account.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                            {account.status === 'active' ? 'подключено' : 'отключено'}
                          </Text>
                        </View>
                        <View style={styles.accountField}>
                          <Text style={styles.fieldLabel}>Скорость:</Text>
                          <Text style={styles.fieldValue}>50 Мб/с</Text>
                        </View>
                        <View style={styles.accountField}>
                          <Text style={styles.fieldLabel}>Адрес подключения:</Text>
                          <Text style={styles.fieldValue}>Респ ингушетия, г Назрань, ул Алиева, дом 3, 386140</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.periodicServicesButton}
                          onPress={() => showPeriodicServices(account.id)}
                        >
                          <Text style={styles.periodicServicesText}>Периодические услуги</Text>
                          <Icon name="arrow-forward-ios" size={16} color="#2E7D32" />
                        </TouchableOpacity>
                      </>
                    )}

                    {account.agent_type === 'TVIP' && (
                      <>
                        <View style={styles.accountField}>
                          <Text style={styles.fieldLabel}>Пакет:</Text>
                          <Text style={styles.fieldValue}>{account.tariff_name}</Text>
                        </View>
                        <View style={styles.accountField}>
                          <Text style={styles.fieldLabel}>Логин:</Text>
                          <Text style={styles.fieldValue}>itt{contract?.number}</Text>
                        </View>
                        <View style={styles.accountField}>
                          <Text style={styles.fieldLabel}>Пароль:</Text>
                          <Text style={styles.fieldValue}>16088</Text>
                        </View>
                      </>
                    )}

                    {account.agent_type === 'UsBox' && (
                      <>
                        <View style={styles.accountField}>
                          <Text style={styles.fieldLabel}>Услуги:</Text>
                          <Text style={styles.fieldValue}>{account.tariff_name}</Text>
                        </View>
                      </>
                    )}

                    <View style={styles.accountActions}>
                      <TouchableOpacity style={styles.accountActionButton}>
                        <Text style={styles.accountActionText}>Включить</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.accountActionButton}>
                        <Text style={styles.accountActionText}>Сменить тариф</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </PagerView>

            {/* Account Pagination */}
            {accounts.length > 1 && (
              <View style={styles.pagination}>
                {accounts.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.paginationDot,
                      index === currentAccountIndex && styles.paginationDotActive
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Periodic Services Modal */}
      <PeriodicServicesModal
        visible={periodicServicesVisible}
        onClose={() => setPeriodicServicesVisible(false)}
        accountId={selectedAccountId || ''}
      />

      <LoginModal
        visible={loginVisible}
        loading={authInProgress}
        error={loginError}
        onSubmit={handleLoginSubmit}
        onClose={() => {
          if (!token) {
            return;
          }
          setLoginVisible(false);
          setLoginError(null);
        }}
      />

      <AmountPromptModal
        visible={promiseModalVisible}
        title="Обещанный платеж"
        description="Введите сумму от 50 до 100 ₽"
        min={50}
        max={100}
        initialAmount="75"
        error={promiseError}
        onSubmit={(amount) => {
          if (!activeContractId) {
            setPromiseError('Договор не найден');
            return;
          }
          setPromiseError(null);
          processPromisePayment(activeContractId, amount);
        }}
        onClose={() => setPromiseModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  headerButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  userCard: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  contractNumber: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  contractDate: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginRight: 10,
  },
  balanceButton: {
    backgroundColor: '#E8F5E8',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 1,
    minWidth: 120,
  },
  actionButtonText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
  accountsSection: {
    margin: 15,
  },
  accountsPager: {
    height: 300,
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginHorizontal: 5,
  },
  accountHeader: {
    backgroundColor: '#2E7D32',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  accountTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  accountContent: {
    padding: 20,
  },
  accountField: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 14,
    color: '#333',
  },
  statusActive: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  statusInactive: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  accountActions: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  accountActionButton: {
    borderWidth: 1,
    borderColor: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 8,
    flex: 1,
  },
  accountActionText: {
    color: '#2E7D32',
    fontSize: 14,
    textAlign: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  paginationDotActive: {
    backgroundColor: '#2E7D32',
  },
  periodicServicesButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  periodicServicesText: {
    color: '#2E7D32',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default App;
