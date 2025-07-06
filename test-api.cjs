const axios = require('axios');

const API_BASE = 'http://localhost:3000/api';

async function testAPI() {
  try {
    console.log('🧪 Testing YAMET API...\n');

    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    const healthResponse = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health Check:', healthResponse.data);
    console.log('');

    // Test 2: Login
    console.log('2. Testing Login...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: 'superadmin@yametbatamtiban.com',
      password: 'Superadminyamet'
    });
    console.log('✅ Login successful');
    const token = loginResponse.data.data.token;
    console.log('Token received:', token ? 'Yes' : 'No');
    console.log('');

    // Test 3: Get Anak Data (for number generation)
    console.log('3. Testing Get Anak Data...');
    const anakResponse = await axios.get(`${API_BASE}/anak`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        page: 1,
        limit: 10,
        sortBy: 'nomor_anak',
        sortOrder: 'DESC'
      }
    });
    console.log('✅ Get Anak Data successful');
    console.log('Response status:', anakResponse.data.status);
    console.log('Anak count:', anakResponse.data.data?.length || 0);
    
    // Log nomor anak yang ada
    if (anakResponse.data.data && anakResponse.data.data.length > 0) {
      console.log('📋 Existing nomor_anak:');
      anakResponse.data.data.forEach((anak, index) => {
        console.log(`  ${index + 1}. ${anak.nomor_anak || 'No number'} - ${anak.full_name || 'No name'}`);
      });
    }
    console.log('');

    // Test 4: Get Patients (with token)
    console.log('4. Testing Get Patients...');
    const patientsResponse = await axios.get(`${API_BASE}/patients`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        page: 1,
        limit: 10,
        sortBy: 'dibuat_pada',
        sortOrder: 'DESC'
      }
    });
    console.log('✅ Get Patients successful');
    console.log('Response status:', patientsResponse.data.status);
    console.log('Patients count:', patientsResponse.data.data?.patients?.length || 0);
    console.log('Total:', patientsResponse.data.data?.total || 0);
    console.log('');

    // Test 5: Get Dashboard Stats
    console.log('5. Testing Dashboard Stats...');
    const dashboardResponse = await axios.get(`${API_BASE}/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Dashboard Stats successful');
    console.log('Response status:', dashboardResponse.data.status);
    console.log('');

    console.log('🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testAPI(); 