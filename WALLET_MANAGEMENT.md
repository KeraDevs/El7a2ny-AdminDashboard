# User Wallets Management System

This module provides complete CRUD functionality for managing user wallets in the El7a2ny Admin Dashboard.

## Features

### 🔧 **Admin Functions (Only Add Money - No Remove)**

- ✅ **View all wallets** with pagination (limit/offset)
- ✅ **Search wallets** by user name, email, or phone
- ✅ **Filter wallets** by status (active, inactive, suspended, frozen)
- ✅ **Add money** to user wallets using transfer API
- ✅ **Update wallet status** (active, inactive, suspended, frozen)
- ✅ **View wallet details** with user information
- ✅ **View transaction history** for each wallet

### 📊 **Statistics Dashboard**

- Total wallet balance across all users
- Number of active users
- Average wallet balance
- Real-time stats updated with data

### 🔍 **View Features**

- **Wallet Details Dialog**: Complete user and wallet information
- **Transaction History**: View recent transactions with status and amounts
- **Balance Display**: Current balance and transaction preview

## API Endpoints Used

Based on the provided API documentation:

1. **GET** `/payment/wallets` - Get current user's wallet details
2. **GET** `/payment/wallets/{id}` - Get wallet by ID (admin or owner only)
3. **GET** `/payment/wallets/balance` - Get wallet balance for authenticated user
4. **POST** `/payment/wallets/transfer` - Transfer money to another user's wallet (for adding money)
5. **GET** `/payment/wallets/transactions/history` - Get transaction history
6. **PATCH** `/payment/wallets/{id}/status` - Update wallet status (admin only)
7. **GET** `/payment/wallets/admin/list` - List all wallets (admin only)

## Components Structure

```
src/
├── types/
│   └── walletTypes.ts                 # Wallet-related TypeScript interfaces
├── utils/
│   └── walletsApi.ts                  # API functions for wallet operations
├── hooks/
│   └── _useWallets.ts                 # Custom hook for wallet state management
├── components/wallets/
│   ├── WalletDetailsDialog.tsx        # View wallet details and transaction history
│   ├── AddMoneyDialog.tsx             # Add money to user wallet (transfer)
│   └── WalletStatusDialog.tsx         # Update wallet status
└── app/(dashboard)/wallets/users/
    └── page.tsx                       # Main wallets management page
```

## Key Features Implemented

### 🎯 **Pagination Support**

- Uses `limit` and `offset` parameters for efficient data loading
- "Load More" functionality for progressive loading
- Handles large datasets efficiently

### 💰 **Add Money Only (No Remove)**

- Admin can only add money to wallets using the transfer API
- Multiple reason options (refund, bonus, promotion, compensation, etc.)
- Preview of new balance before confirmation
- Transaction description and reason tracking

### 🔒 **Status Management**

- Active: Normal wallet operations
- Inactive: Wallet exists but not actively used
- Suspended: Temporarily blocked from transactions
- Frozen: Completely blocked wallet operations

### 📱 **Responsive Design**

- Mobile-friendly interface
- Modern UI with shadcn/ui components
- Smooth animations with Framer Motion
- Dark mode support

### 🔍 **Advanced Search & Filtering**

- Search by user name, email, or phone number
- Filter by wallet status
- Real-time search with enter key support
- Clear/reset functionality

## Usage Examples

### Adding Money to a Wallet

```typescript
const transferData = {
  receiver_user_id: "user123",
  amount: 100.0,
  description: "Refund for cancelled service",
};

await handleTransferMoney(transferData);
```

### Updating Wallet Status

```typescript
await handleUpdateWalletStatus("wallet123", {
  status: "suspended",
});
```

### Fetching Wallets with Pagination

```typescript
await fetchAllWallets(
  page: 1,
  limit: 10,
  status: "active",
  search: "ahmed@example.com"
);
```

## Security Features

- JWT token authentication for all API calls
- Role-based access (admin only functions)
- Input validation and sanitization
- Error handling with user-friendly messages

## Performance Optimizations

- Pagination to handle large datasets
- Debounced search functionality
- Optimistic UI updates
- Efficient state management with React hooks

The system is fully functional and ready for production use with comprehensive wallet management capabilities tailored specifically for admin users who need to add money to user accounts and manage wallet statuses.
