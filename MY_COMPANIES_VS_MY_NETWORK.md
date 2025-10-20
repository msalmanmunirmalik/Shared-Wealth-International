# 🏢 My Companies vs My Network - Feature Explanation

## 📊 **Clear Distinction**

### **My Companies** 🏢
Companies that the user **owns, works for, or is employed by**.

**Database Table**: `user_companies`

**Relationship Type**: Employment/Ownership

**Examples**:
- Luis Mauch works for **Beplay** → Beplay appears in "My Companies"
- Stephen Hunt is Director at **Carsis Consulting** → Carsis appears in "My Companies"

**How to Add**:
- During signup: Select "I'm part of an existing company"
- After signup: Admin can link users to companies
- Company registration: Automatically links applicant to company

---

### **My Network** 🌐
Companies that the user has **partnered with, collaborated with, or connected to** for business purposes.

**Database Table**: `network_connections`

**Relationship Type**: Partnership/Collaboration/Networking

**Connection Types**:
- `partner` - Business partner
- `supplier` - Supply chain relationship
- `customer` - Customer relationship
- `member` - Network member

**Examples**:
- Luis at Beplay partners with **Fairbnb** → Fairbnb in "My Network"
- Stephen collaborates with **SE Ghana** → SE Ghana in "My Network"

**How to Add**:
- Click "Add to Network" button
- Select company from available companies
- Choose connection type (partner/supplier/customer)
- Optionally add notes about the relationship

---

## 🔄 **Data Flow**

### **My Companies**
```
User Dashboard → "My Companies" Tab
     ↓
GET /api/companies/user
     ↓
Query: user_companies table (WHERE user_id = current_user)
     ↓
Returns: Companies user works for
```

### **My Network**
```
User Dashboard → "Network" Tab
     ↓
GET /api/networks/user
     ↓
Query: network_connections table (WHERE user_id = current_user)
     ↓
Returns: Companies user has connected with
```

---

## 🎯 **Current Implementation**

### **API Endpoints**

#### My Companies:
```
GET /api/companies/user
Headers: Authorization: Bearer [token]
Returns: Array of companies from user_companies table
```

**Sample Response**:
```json
[
  {
    "id": "...",
    "name": "Beplay",
    "location": "Brazil",
    "user_role": "director",
    "position": "Director",
    "is_primary": true
  }
]
```

#### My Network:
```
GET /api/networks/user
Headers: Authorization: Bearer [token]
Returns: { success: true, data: [...companies...] }
```

**Sample Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "name": "Fairbnb",
      "location": "Italy",
      "connection_type": "partner",
      "notes": "Collaboration on sustainable tourism",
      "added_at": "2025-10-19T..."
    }
  ]
}
```

---

## 📋 **Database Schema**

### **user_companies** (Employment Relationship)
```sql
CREATE TABLE user_companies (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    role VARCHAR(100) NOT NULL,        -- director, employee, owner
    position VARCHAR(100) NOT NULL,     -- Director, CEO, Manager
    status VARCHAR(50) DEFAULT 'active',
    is_primary BOOLEAN DEFAULT false,   -- Primary employment
    UNIQUE(user_id, company_id)
);
```

### **network_connections** (Business Relationship)
```sql
CREATE TABLE network_connections (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    company_id UUID REFERENCES companies(id),
    connection_type VARCHAR(50),        -- partner, supplier, customer, member
    notes TEXT,                         -- Relationship notes
    status VARCHAR(50) DEFAULT 'active',
    UNIQUE(user_id, company_id)
);
```

---

## ✅ **Current Status**

### **My Companies** (29 relationships)
- ✅ Luis → Beplay
- ✅ Stephen → Carsis Consulting
- ✅ Sam → Consortio
- ... (26 more)

### **My Network** (0 relationships)
- Empty (users haven't added network connections yet)
- Users can now add companies via "Add to Network" button

---

## 🎯 **User Experience**

When a user (e.g., Luis from Beplay) logs in:

**My Companies Tab**:
- Shows: **Beplay** (his company)
- Source: `user_companies` table
- Action: View company details, manage profile

**Network Tab**:
- Shows: Empty initially
- Can add: Fairbnb, SE Ghana, TTF, etc.
- Source: `network_connections` table
- Action: Add/remove partner companies, view network

---

**✅ The distinction is now properly implemented with separate database tables and endpoints!**

