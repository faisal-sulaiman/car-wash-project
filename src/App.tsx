import React, { useState, useEffect } from 'react';
import { Car, Bike, Truck, Settings, Receipt, Printer, RefreshCw, Waves, Sparkles } from 'lucide-react';

interface VehiclePrices {
  bike: number;
  car: number;
  gli: number;
  xli: number;
  carry: number;
}

interface WashingService {
  id: string;
  name: string;
  price: number;
}

interface InvoiceData {
  vehicle: string;
  services: WashingService[];
  total: number;
  timestamp: string;
}

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'service' | 'invoice' | 'login'>('home');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [vehiclePrices, setVehiclePrices] = useState<VehiclePrices>({
    bike: 150,
    car: 300,
    gli: 400,
    xli: 350,
    carry: 500
  });
  const [tempPrices, setTempPrices] = useState<VehiclePrices>(vehiclePrices);
  const [selectedServices, setSelectedServices] = useState<WashingService[]>([]);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  const vehicleTypes = [
    { key: 'bike', name: 'Bike', icon: Bike, color: 'bg-green-500' },
    { key: 'car', name: 'Car', icon: Car, color: 'bg-blue-500' },
    { key: 'gli', name: 'GLI', icon: Car, color: 'bg-purple-500' },
    { key: 'xli', name: 'XLI', icon: Car, color: 'bg-red-500' },
    { key: 'carry', name: 'Carry', icon: Truck, color: 'bg-orange-500' }
  ];

  const washingServices = [
    { id: 'external', name: 'External Wash', basePrice: 100 },
    { id: 'internal_external', name: 'Internal & External Wash', basePrice: 200 },
    { id: 'diesel', name: 'Diesel Treatment', basePrice: 150 },
    { id: 'polish', name: 'Polish & Wax', basePrice: 300 }
  ];

  const USERNAME = "admin";
  const PASSWORD = "admin123";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      loginForm.username === USERNAME &&
      loginForm.password === PASSWORD
    ) {
      setIsAuthenticated(true);
      setLoginError('');
      setCurrentView('dashboard');
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('home');
    setLoginForm({ username: '', password: '' }); // Clear login form
  };

  const handleVehicleSelect = (vehicleKey: string) => {
    setSelectedVehicle(vehicleKey);
    setSelectedServices([]);
    setCurrentView('service');
  };

  const handleServiceToggle = (service: { id: string; name: string; basePrice: number }) => {
    const vehicleMultiplier = selectedVehicle === 'bike' ? 0.7 : 
                             selectedVehicle === 'carry' ? 1.3 : 1;
    
    const servicePrice = Math.round(service.basePrice * vehicleMultiplier);
    const newService: WashingService = {
      id: service.id,
      name: service.name,
      price: servicePrice
    };

    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === service.id);
      if (exists) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, newService];
      }
    });
  };

  const generateInvoice = () => {
    const vehicleName = vehicleTypes.find(v => v.key === selectedVehicle)?.name || '';
    const total = selectedServices.reduce((sum, service) => sum + service.price, 0);
    
    const invoice: InvoiceData = {
      vehicle: vehicleName,
      services: selectedServices,
      total,
      timestamp: new Date().toLocaleString()
    };
    
    setInvoiceData(invoice);
    setCurrentView('invoice');
  };

  const printInvoice = () => {
    window.print(); // Only open print dialog, no WhatsApp message
  };

  const startNewOrder = () => {
    setSelectedVehicle('');
    setSelectedServices([]);
    setInvoiceData(null);
    setCurrentView('home');
  };

  const savePrices = () => {
    setVehiclePrices(tempPrices);
    alert('Prices updated successfully!');
  };

  const isServiceSelected = (serviceId: string) => {
    return selectedServices.some(s => s.id === serviceId);
  };

  const totalAmount = selectedServices.reduce((sum, service) => sum + service.price, 0);

  const sendInvoiceToWhatsApp = () => {
    if (!invoiceData) return;
    const adminNumber = "03479896180"; // Replace with admin's WhatsApp number (country code + number, no +)
    let message = `*AquaCarWash Invoice*\n\n`;
    message += `*Date:* ${invoiceData.timestamp}\n`;
    message += `*Vehicle:* ${invoiceData.vehicle}\n`;
    message += `*Services:*\n`;
    invoiceData.services.forEach(service => {
      message += `- ${service.name}: ₹${service.price}\n`;
    });
    message += `\n*Total Amount:* ₹${invoiceData.total}\n\nThank you!`;

    const url = `https://wa.me/${adminNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Waves className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AquaCarWash</h1>
                <p className="text-sm text-gray-600">Premium Car Wash Service</p>
              </div>
            </div>
            <nav className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors w-full sm:w-auto ${
                  currentView === 'home' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setCurrentView('dashboard');
                  } else {
                    setCurrentView('login');
                  }
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 w-full sm:w-auto ${
                  currentView === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Dashboard</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Home View */}
        {currentView === 'home' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Select Your Vehicle</h2>
              <p className="text-xl text-gray-600">Choose your vehicle type to get started</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {vehicleTypes.map((vehicle) => {
                const IconComponent = vehicle.icon;
                return (
                  <div
                    key={vehicle.key}
                    onClick={() => handleVehicleSelect(vehicle.key)}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-200"
                  >
                    <div className="p-6 text-center">
                      <div className={`w-16 h-16 ${vehicle.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <IconComponent className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{vehicle.name}</h3>
                      <p className="text-lg font-bold text-blue-600">₹{vehiclePrices[vehicle.key as keyof VehiclePrices]}</p>
                      <p className="text-sm text-gray-500 mt-1">Base Price</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Dashboard View */}
        {currentView === 'dashboard' && isAuthenticated && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Price Management</h2>
              <p className="text-xl text-gray-600">Update vehicle base prices</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicleTypes.map((vehicle) => {
                  const IconComponent = vehicle.icon;
                  return (
                    <div key={vehicle.key} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-10 h-10 ${vehicle.color} rounded-full flex items-center justify-center`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">{vehicle.name}</h3>
                      </div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Base Price (₹)
                      </label>
                      <input
                        type="number"
                        value={tempPrices[vehicle.key as keyof VehiclePrices]}
                        onChange={(e) => setTempPrices(prev => ({
                          ...prev,
                          [vehicle.key]: parseInt(e.target.value) || 0
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={savePrices}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <Settings className="h-5 w-5" />
                  <span>Save Prices</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end mb-4">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Service Selection View */}
        {currentView === 'service' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Select Washing Services</h2>
              <p className="text-xl text-gray-600">
                Vehicle: <span className="font-semibold text-blue-600">
                  {vehicleTypes.find(v => v.key === selectedVehicle)?.name}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {washingServices.map((service) => {
                const vehicleMultiplier = selectedVehicle === 'bike' ? 0.7 : 
                                         selectedVehicle === 'carry' ? 1.3 : 1;
                const servicePrice = Math.round(service.basePrice * vehicleMultiplier);
                const selected = isServiceSelected(service.id);

                return (
                  <div
                    key={service.id}
                    onClick={() => handleServiceToggle(service)}
                    className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-300 border-2 ${
                      selected 
                        ? 'border-green-500 bg-green-50 transform scale-105' 
                        : 'border-transparent hover:border-blue-200 hover:shadow-xl'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          selected ? 'bg-green-500' : 'bg-blue-500'
                        }`}>
                          <Sparkles className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-2xl font-bold text-blue-600">₹{servicePrice}</p>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selected ? 'bg-green-500 border-green-500' : 'border-gray-300'
                      }`}>
                        {selected && <div className="w-3 h-3 bg-white rounded-full"></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedServices.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Order Summary</h3>
                  <div className="text-3xl font-bold text-green-600">₹{totalAmount}</div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {selectedServices.map((service) => (
                    <div key={service.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">{service.name}</span>
                      <span className="font-semibold text-gray-900">₹{service.price}</span>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={generateInvoice}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Receipt className="h-6 w-6" />
                  <span>Generate Invoice</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Invoice View */}
        {currentView === 'invoice' && invoiceData && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Invoice Generated</h2>
              <p className="text-xl text-gray-600">Thank you for choosing AquaCarWash!</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto" id="invoice">
              <div className="border-b-2 border-blue-500 pb-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-500 rounded-lg">
                      <Waves className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">AquaCarWash</h3>
                      <p className="text-gray-600">Premium Car Wash Service</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Invoice Date</p>
                    <p className="font-semibold">{invoiceData.timestamp}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Service Details</h4>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Vehicle Type:</span>
                    <span className="font-semibold text-gray-900">{invoiceData.vehicle}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {invoiceData.services.map((service, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">{service.name}</span>
                      <span className="font-semibold text-gray-900">₹{service.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span className="text-gray-900">Total Amount:</span>
                  <span className="text-green-600">₹{invoiceData.total}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={printInvoice}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Printer className="h-5 w-5" />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={sendInvoiceToWhatsApp}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <span>Send to WhatsApp</span>
              </button>
              <button
                onClick={startNewOrder}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <RefreshCw className="h-5 w-5" />
                <span>New Order</span>
              </button>
            </div>
          </div>
        )}

        {/* Login View */}
        {currentView === 'login' && (
          <div className="flex justify-center items-center min-h-[60vh]">
            <form
              onSubmit={handleLogin}
              className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Admin Login</h2>
              {loginError && (
                <div className="text-red-600 text-sm mb-2 text-center">{loginError}</div>
              )}
              <div>
                <label className="block text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold"
              >
                Login
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;