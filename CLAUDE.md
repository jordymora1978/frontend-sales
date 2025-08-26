# 🛒 SALES FRONTEND - CLAUDE INSTRUCTIONS

> **CRITICAL**: Read `/dropux/ECOSYSTEM.md` FIRST, then this file.

## 🎯 PROJECT CONTEXT

**Service**: Sales Frontend (React UI)
**Domain**: https://sales.dropux.co
**Local**: http://localhost:3001
**Backend**: https://api-sales.dropux.co
**Function**: MercadoLibre sales management, AI-powered order processing, automated business intelligence

## ⚡ CRITICAL DEPENDENCIES

### MercadoLibre Integration UI
- **OAuth Flow**: ML store connection interface
- **Order Dashboard**: Real-time order management + AI intelligence
- **Customer Service**: Message handling and responses
- **NEVER BREAK**: ML OAuth redirect flow or production order handling

### 🤖 **AI Business Intelligence System** (NEW)
- **Automated Rules Engine**: Instant tagging based on structured data
- **AI Message Analysis**: Smart pattern detection from ML messages
- **Hybrid Processing**: Combines free rules + AI insights
- **Real-time Intelligence**: Automatic risk assessment and priority scoring

### Current Status
- **Active Users**: 3 (admin, operator, viewer)
- **Connected Stores**: 1 (Todoencargo-co)
- **Daily Orders**: 50+ orders processed
- **Production**: ✅ LIVE with real customers and money

## 🔧 TECHNICAL STACK

- **Framework**: React 19
- **Language**: JavaScript (TypeScript preferred for new files)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Auth**: JWT Bearer tokens
- **HTTP Client**: Axios
- **Deploy**: Vercel

## 🎨 UI COMPONENT STRUCTURE

```
src/
├── components/
│   ├── Auth/          # Login, logout, user management
│   ├── Dashboard/     # Main sales dashboard
│   ├── Orders/        # Order list, details, processing
│   ├── Stores/        # ML store connection and management
│   ├── Customers/     # Customer service interface
│   └── Common/        # Shared UI components
├── pages/
├── services/          # API calls to backend
├── utils/             # Utilities and helpers
└── context/           # Auth and app state
```

## 🌐 KEY FEATURES & PAGES

### Authentication
- **Login Page**: JWT authentication with api-sales
- **User Dashboard**: Role-based access (admin/operator/viewer)
- **Protected Routes**: Route guards for authenticated users

### MercadoLibre Integration (CRITICAL - PRODUCTION)
- **Store Connection**: OAuth flow to connect ML stores
- **Store Dashboard**: Connected stores management
- **Order Sync**: Manual and automatic order synchronization
- **Webhook Status**: Real-time webhook notification display

### 🤖 **AI-Enhanced Order Management** (UPGRADED)
- **Smart Order List**: Paginated table with AI-powered filters
- **Intelligent Tagging**: Automated business rules + AI analysis
- **Order Details**: Complete information + AI insights
- **Status Updates**: Order status changes and tracking
- **Customer Messages**: ML messaging interface with AI pattern detection

### 🧠 **AI Intelligence Features**
- **Business Rules Engine**: ⚙️ Free, instant analysis (6 rules)
  - Envío Crítico, Alto Valor, Cliente VIP, Margen Bajo, Apple Product, Internacional
- **AI Message Analysis**: 🤖 Smart pattern detection (8 patterns)
  - Cancellation intent, invoice requests, shipping concerns, warranty issues
- **Dynamic Tag Filtering**: Click tags to filter orders by intelligence
- **Real-time Counters**: Tag counts like "Pide Factura 4"
- **Hybrid Processing**: Cost-optimized (80% rules, 20% AI)

### Reports & Analytics
- **Sales Reports**: Daily, weekly, monthly sales data
- **Performance Metrics**: Order processing times
- **Revenue Tracking**: Financial summaries
- **AI Intelligence Reports**: Tag distribution and pattern insights

## 🚨 RULES FOR CLAUDE

### ❌ ABSOLUTELY NEVER:
1. **Break ML OAuth flow**: Users lose access to their stores
2. **Modify authentication**: Real users will be logged out
3. **Remove order actions**: Production order processing
4. **Change API endpoints**: Must match backend exactly
5. **Hardcode credentials**: Use environment variables only

### ⚠️ BE EXTREMELY CAREFUL:
1. **Order status updates**: Affects real customer orders
2. **API calls**: Backend has rate limiting
3. **User permissions**: Role-based access control
4. **State management**: Order data consistency
5. **Error handling**: User experience for production errors

### ✅ SAFE TO DO:
1. **Improve UI/UX**: Better user experience
2. **Add loading states**: User feedback improvements
3. **Add new components**: Following existing patterns
4. **Update styling**: Visual improvements
5. **Add validation**: Form input validation

## 🔗 API INTEGRATION

### Backend Connection
```javascript
// API configuration
const API_BASE_URL = process.env.REACT_APP_SALES_API_URL || 'https://api-sales.dropux.co';

// Standard API call pattern
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }
  
  return response.json();
};
```

### Key API Endpoints Used
```javascript
// Authentication
POST /auth/login
GET /auth/me

// MercadoLibre
GET /api/ml/my-stores
POST /api/ml/stores/setup
POST /api/ml/refresh-token/{store_id}

// Orders
GET /api/ml/stores/{store_id}/orders
GET /api/ml/stores/{store_id}/orders/{order_id}
POST /api/ml/stores/{store_id}/sync-orders
```

## 💻 LOCAL DEVELOPMENT

### Setup
```bash
cd C:\Users\jordy\proyectos\dropux\frontend-sales
npm install
npm start
```

### Environment Variables (.env.local)
```env
# API Backend
REACT_APP_SALES_API_URL=http://localhost:8001

# Production
REACT_APP_SALES_API_URL=https://api-sales.dropux.co

# Development
PORT=3001
BROWSER=none
```

### Development Commands
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests (if available)
npm test
```

## 🎨 STYLING GUIDELINES

### Tailwind CSS Standards
```javascript
// ✅ Use Tailwind utility classes
<div className="bg-white shadow-lg rounded-lg p-6 mb-4">
  <h2 className="text-xl font-semibold text-gray-800 mb-2">
    Order Details
  </h2>
</div>

// ✅ Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### Component Patterns
```javascript
// ✅ Standard component template
const OrderCard = ({ order, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  
  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      await onStatusChange(order.id, newStatus);
    } catch (error) {
      console.error('Error updating order:', error);
      // Show user-friendly error message
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      {/* Component content */}
    </div>
  );
};
```

## 🐛 COMMON ISSUES & SOLUTIONS

### Authentication Issues
```javascript
// ✅ Handle token expiration
const handleApiError = (error) => {
  if (error.status === 401) {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  }
};
```

### ML OAuth Flow Issues
- Check redirect URI matches backend exactly
- Verify state parameter handling
- Handle OAuth errors gracefully

### Order Loading Performance
```javascript
// ✅ Implement pagination and loading states
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
```

### State Management
```javascript
// ✅ Use Context for global state
const SalesContext = createContext();

export const SalesProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [stores, setStores] = useState([]);
  
  return (
    <SalesContext.Provider value={{ user, stores, setUser, setStores }}>
      {children}
    </SalesContext.Provider>
  );
};
```

## 📱 RESPONSIVE DESIGN REQUIREMENTS

- **Mobile**: 320px - 768px (touch-friendly order management)
- **Tablet**: 768px - 1024px (efficient dashboard layout)
- **Desktop**: 1024px+ (full feature access)

## 🚀 DEPLOYMENT

### Vercel Auto-Deploy
```bash
# Any push to main triggers deploy
git add .
git commit -m "Sales Frontend: [description]"
git push origin main
```

### Environment Variables (Vercel)
Set in Vercel dashboard:
```env
REACT_APP_SALES_API_URL=https://api-sales.dropux.co
```

## 🆘 EMERGENCY PROCEDURES

### Frontend Not Loading
1. Check Vercel deployment status
2. Verify API backend is responsive
3. Check browser console for errors
4. Review recent commits

### ML OAuth Not Working
1. Verify backend OAuth endpoint
2. Check redirect URI configuration
3. Test OAuth flow manually
4. Check browser cookies/localStorage

### Orders Not Loading
1. Test API endpoint directly
2. Check authentication token
3. Verify user permissions
4. Check network connectivity

## 🔄 MODERN REACT STANDARDS

### Component Patterns
```javascript
// ✅ Use functional components with hooks
const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await apiCall('/api/orders');
        setOrders(data.orders);
      } catch (error) {
        console.error('Failed to load orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadOrders();
  }, []);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="space-y-4">
      {orders.map(order => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};
```

## 📋 PRE-DEPLOYMENT CHECKLIST

Before any changes go live:
- [ ] ML OAuth flow still works
- [ ] All API endpoints respond correctly
- [ ] Authentication works for existing users
- [ ] Order operations work without errors
- [ ] **AI Business Rules Engine works** ⚙️
- [ ] **AI Message Analysis functions** 🤖
- [ ] **Tag filtering and counters work**
- [ ] **No AI processing errors in console**
- [ ] Responsive design works on all devices
- [ ] No console errors in production
- [ ] Environment variables configured correctly

---

## 🎯 SUCCESS CRITERIA

✅ **User access**: All existing users can login and work normally
✅ **ML integration**: Store connection and order sync working
✅ **Order processing**: Real orders handled without issues
✅ **🤖 AI Intelligence**: Business rules + message analysis working
✅ **🚀 Hybrid Processing**: 80% rules (free) + 20% AI (cost-optimized)
✅ **📊 Smart Filtering**: Tag-based order filtering and counters
✅ **Performance**: Fast loading and responsive interface
✅ **Mobile support**: Usable on mobile devices
✅ **Error handling**: Graceful error messages for users

**Remember**: This handles real sales operations. Test everything twice.

---

## 🤖 **AI BUSINESS INTELLIGENCE SYSTEM - TECHNICAL DETAILS**

### **Implementation Architecture**
```javascript
// File: src/pages/OrdersPage2_0.jsx

// 1. BUSINESS RULES ENGINE (Free, Instant)
const applyBusinessRules = (orders) => {
  // ⚙️ 6 automated patterns based on structured data
  // - Envío Crítico: purchaseDate > 4 days
  // - Alto Valor: total > $500
  // - Cliente VIP: customer.previousOrders >= 10
  // - Margen Bajo: profitMargin < 15%
  // - Apple Product: productTitle contains iPhone/MacBook
  // - Internacional: location.country !== 'COLOMBIA'
};

// 2. AI MESSAGE ANALYSIS (Cost per use)
const analyzeMLMessages = (messages) => {
  // 🤖 8 pattern detection from MercadoLibre messages
  // - Intención de Cancelar, Pide Factura, Duda con Envío, etc.
  // Uses mock implementation - ready for real AI API integration
};
```

### **UI Components**
```javascript
// Thin AI Bar - Located below main filter bar
<div className="flex items-center justify-between py-2 px-4 bg-gray-50 border-b">
  {/* Left side - Generated tags with counters */}
  <div className="flex gap-1">
    <button>Pide Factura 4</button>
    <button>Envío Crítico 2</button>
  </div>
  
  {/* Right side - AI buttons */}
  <div className="flex gap-1">
    <button onClick={runBusinessRulesAnalysis}>⚙️</button>
    <button onClick={runIntelligentAnalysis}>🤖</button>
  </div>
</div>
```

### **Data Structure Requirements**
```javascript
// Order object must include these fields for AI processing:
{
  id: 'string',
  productTitle: 'string',
  total: number,
  profitMargin: number,
  purchaseDate: 'YYYY-MM-DD',
  customer: {
    name: 'string',
    previousOrders: number
  },
  location: {
    country: 'string',
    city: 'string'
  },
  tags: ['array', 'of', 'strings'] // AI will populate this
}
```

### **Testing & Debugging**
```bash
# Open browser console while testing
# Both AI functions log detailed processing info:

🤖 Iniciando análisis IA...
📊 Órdenes disponibles: 12
🔧 Aplicando reglas de negocio automáticas...
🚨 Orden MGA-PE4998: Envío crítico (6 días)
💎 Orden ORD-2025003: Alto valor ($1850)
✅ Reglas aplicadas: 6 tipos de etiquetas automáticas
```

### **Cost Optimization Strategy**
- **Primary**: Use ⚙️ Business Rules (free) for 80% of classification
- **Secondary**: Use 🤖 AI Analysis for complex text patterns only
- **Hybrid**: Combine both for comprehensive intelligence
- **Scalable**: Add more business rules as patterns become clear

### **Production Integration Points**
- **Mock Data**: Currently uses mock ML messages for AI testing
- **Real Integration**: Replace `analyzeMLMessages()` with actual AI API calls
- **API Ready**: Structure prepared for OpenAI, Claude, or custom ML models
- **Fallback**: Business rules work regardless of AI service availability

---

*Frontend: 🟢 Production Live + AI Enhanced*  
*Users: ✅ 3 Active*  
*AI Features: 🤖 14+ Smart Tags, Hybrid Processing*  
*Last Updated: 2025-08-26*