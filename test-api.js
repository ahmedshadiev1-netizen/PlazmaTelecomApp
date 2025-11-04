const axios = require('axios');

const API_BASE_URL = 'http://192.168.56.1:8000';

async function testAPI() {
  try {
    console.log('🔍 Тестирование API...');
    
    // 1. Проверяем доступность API
    console.log('\n1. Проверка доступности API...');
    const healthResponse = await axios.get(`${API_BASE_URL}/admin/health`);
    console.log('✅ API доступен:', healthResponse.data);
    
    // 2. Тестируем логин
    console.log('\n2. Тестирование логина...');
    const loginFormData = new FormData();
    loginFormData.append('username', 'Test-Ne-Udalyat');
    loginFormData.append('password', 'Test-Ne-Udalyat');
    
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, loginFormData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const token = loginResponse.data.access_token;
    console.log('✅ Логин успешен, токен получен');
    
    // 3. Тестируем получение аккаунтов
    console.log('\n3. Тестирование получения аккаунтов...');
    const accountsResponse = await axios.get(`${API_BASE_URL}/accounts`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Аккаунты получены:', accountsResponse.data.length, 'штук');
    
    // 4. Тестируем периодические услуги для первого аккаунта
    if (accountsResponse.data.length > 0) {
      const firstAccount = accountsResponse.data[0];
      console.log('\n4. Тестирование периодических услуг для аккаунта:', firstAccount.id);
      
      const periodicResponse = await axios.get(`${API_BASE_URL}/accounts/${firstAccount.id}/periodic-services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('✅ Периодические услуги получены:', periodicResponse.data.length, 'штук');
      console.log('📋 Данные услуг:');
      periodicResponse.data.forEach((service, index) => {
        console.log(`  ${index + 1}. ${service.description}`);
        console.log(`     Количество: ${service.quantity}`);
        console.log(`     Цена: ${service.price} ₽`);
        console.log(`     Итоговая стоимость: ${service.total_cost} ₽`);
        console.log(`     Статус: ${service.total_cost > 0 ? 'Включена, тарифицируется' : 'Отключена'}`);
        console.log('');
      });
    }
    
    console.log('🎉 Все тесты прошли успешно!');
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error.message);
    if (error.response) {
      console.error('Детали ошибки:', error.response.data);
    }
  }
}

testAPI();

