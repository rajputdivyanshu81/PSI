import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchTasks, createTask, deleteTask, updateTask, uploadTaskAttachments } from '../features/tasks/taskSlice';
import { logout } from '../features/auth/authSlice';
import { Plus, LogOut, CheckCircle, Clock, Trash2, Shield, Paperclip, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const { user } = useAppSelector((state) => state.auth);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    dispatch(fetchTasks({}));
  }, [dispatch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    await dispatch(createTask({ title, description, status: 'TODO', priority: 'MEDIUM' }));
    setTitle('');
    setDescription('');
    setIsFormOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">TaskFlow</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600">
                  <Shield className="h-4 w-4 mr-1 text-indigo-500" />
                  Admin Panel
                </Link>
              )}
              <span className="text-gray-700 font-medium">Hello, {user?.email}</span>
              <button
                onClick={() => dispatch(logout())}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
          <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>

        {isFormOpen && (
          <div className="bg-white shadow rounded-lg p-6 mb-6 mx-4 sm:mx-0">
            <form onSubmit={handleCreate}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        )}

        {loading && <p className="text-gray-500 ml-4">Loading tasks...</p>}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-0">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white overflow-hidden shadow rounded-lg border-t-4 border-indigo-500">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{task.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    task.status === 'DONE' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-500 line-clamp-3">{task.description}</p>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => dispatch(updateTask({ id: task.id, taskData: { status: task.status === 'DONE' ? 'TODO' : 'DONE' } }))}
                    className="text-gray-400 hover:text-green-500"
                    title="Toggle Status"
                  >
                    <CheckCircle className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => dispatch(deleteTask(task.id))}
                    className="text-gray-400 hover:text-red-500"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {/* Attachments Section */}
              <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200">
                <div className="flex flex-col space-y-2">
                  <div className="text-sm font-medium text-gray-700 flex justify-between items-center">
                    <span>Attachments ({task.attachments?.length || 0}/3)</span>
                    {(task.attachments?.length || 0) < 3 && (
                      <label className="cursor-pointer text-indigo-600 hover:text-indigo-500 flex items-center text-xs">
                        <Upload className="h-3 w-3 mr-1" />
                        Upload PDF
                        <input
                          type="file"
                          accept=".pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const formData = new FormData();
                              formData.append('files', e.target.files[0]);
                              dispatch(uploadTaskAttachments({ id: task.id, formData }));
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>
                  {task.attachments && task.attachments.length > 0 && (
                    <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                      {task.attachments.map((att) => (
                        <li key={att.id} className="pl-3 pr-4 py-2 flex items-center justify-between text-sm">
                          <div className="w-0 flex-1 flex items-center text-indigo-600">
                            <Paperclip className="flex-shrink-0 h-4 w-4 text-gray-400" />
                            <a href={`http://localhost:5000${att.url}`} target="_blank" rel="noreferrer" className="ml-2 truncate hover:text-indigo-500">
                              {att.filename}
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
          {tasks.length === 0 && !loading && (
             <div className="col-span-full text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
               <p className="text-gray-500">No tasks found. Create one to get started!</p>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
