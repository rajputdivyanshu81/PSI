import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUsers } from '../admin/adminSlice';
import { Users, Shield, Clock } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-6 px-4 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">Manage system users and their roles</p>
      </div>

      {loading ? (
        <p className="px-4 text-gray-500">Loading users...</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => (
              <li key={user.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-600 truncate">{user.email}</p>
                      <p className="mt-1 flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        Joined on {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'ADMIN' && <Shield className="mr-1 h-3 w-3" />}
                      {user.role}
                    </span>
                    <p className="mt-1 text-xs text-gray-400">ID: {user.id}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
