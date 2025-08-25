import React, { useEffect, useState } from 'react';
import { supabase } from '../util/supabaseClient';

export default function TestProperties() {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('Testing Supabase connection...');
      
      // Test 1: Basic connection
      const { data: testData, error: testError } = await supabase
        .from('properties')
        .select('id, title, price')
        .limit(5);
      
      if (testError) {
        console.error('Test Error:', testError);
        setError(`Connection Error: ${testError.message}`);
        return;
      }
      
      console.log('Test Data:', testData);
      
      // Test 2: Full query
      const { data, error, count } = await supabase
        .from('properties')
        .select('*', { count: 'exact' })
        .eq('status', 'active')
        .limit(10);
      
      if (error) {
        console.error('Query Error:', error);
        setError(`Query Error: ${error.message}`);
        return;
      }
      
      console.log('Properties Found:', count);
      console.log('Properties Data:', data);
      
      setProperties(data || []);
      setError(null);
    } catch (err) {
      console.error('Unexpected Error:', err);
      setError(`Unexpected Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const insertTestProperty = async () => {
    const testProperty = {
      title: 'Test Property ' + Date.now(),
      description: 'This is a test property',
      property_type: 'residential',
      category: 'sale',
      status: 'active',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      price: 5000000,
      bedrooms: 3,
      bathrooms: 2,
      area_sqft: 1500,
      listed_date: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('properties')
      .insert(testProperty)
      .select();
    
    if (error) {
      console.error('Insert Error:', error);
      alert('Insert Error: ' + error.message);
    } else {
      console.log('Inserted:', data);
      alert('Test property inserted successfully!');
      testConnection();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <div className="mb-4">
        <button 
          onClick={testConnection}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Refresh Data
        </button>
        <button 
          onClick={insertTestProperty}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Insert Test Property
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="font-bold mb-2">Properties Found: {properties.length}</h2>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(properties, null, 2)}
        </pre>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Check browser console for detailed logs</p>
        <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'NOT SET'}</p>
        <p>Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}</p>
      </div>
    </div>
  );
}