import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, User, Calendar, CheckCircle, Circle, Clock, AlertCircle, X, Save, RefreshCw } from 'lucide-react';
import { createTask, deleteTask, getAllTasks, updateTask } from '../service/taskService';
import Cookies from "js-cookie";


export default function TaskDashboard() {
 const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [showEditModal, setShowEditModal] = useState(false);
   const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      setLoading(true);
      const data = await getAllTasks();
      console.log(data,"afds")
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

 

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const openEditModal = (task: any) => {
    setEditingTask(task);
    setFormData({ title: task.title, description: task.description || '' });
    setShowEditModal(true);
  };

  const handleEditTask = async () => {
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }

    
    try {
      const updatedTask = await updateTask(editingTask.id, {
        title: formData.title,
        description: formData.description
      });

      setTasks(tasks.map(t => (t.id === editingTask.id ? updatedTask : t)));
      await fetchAllTasks(); 
      setShowEditModal(false);
      setEditingTask(null);
      setFormData({ title: '', description: '' });

    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task');
    }
  };


const handleAddTask = async () => {
  if (!formData.title.trim()) {
    alert("Title is required");
    return;
  }

  try {
    const userCookie = Cookies.get("user"); 
    const loggedUser = userCookie ? JSON.parse(userCookie) : null;

    if (!loggedUser?.id) {
      alert("No logged-in user found in cookies");
      return;
    }

    const newTask = await createTask({
      title: formData.title,
      description: formData.description,
      completed: false,
      userId: loggedUser.id,
    });

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setShowAddModal(false);
    setFormData({ title: "", description: "" });
  } catch (error) {
    console.error("Error creating task:", error);
    alert("Failed to create task");
  }
};


const handleToggleComplete = async (taskId: number) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
    
      const updatedTask = { ...task, completed: !task.completed };
      
      setTasks(tasks.map(t => (t.id === taskId ? updatedTask : t)));
    } catch (error) {
      console.error('Error toggling task:', error);
      alert('Failed to toggle task completion');
    }
  };


const filteredTasks = tasks
  .filter(task => {
    if (filterStatus === 'active') return !task.completed;
    if (filterStatus === 'completed') return task.completed;
    return true;
  })
  .filter(task => {
    const title = task?.title?.toLowerCase() || "";
    const description = task?.description?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return title.includes(search) || description.includes(search);
  });


  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const inProgressTasks = tasks.filter(t => !t.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-2">
                Task Management
              </h1>
              <p className="text-gray-600 text-lg">Manage your tasks and track progress</p>
            </div>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Add New Task
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                <Circle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-900">{totalTasks}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">Completed</p>
            <p className="text-3xl font-bold text-gray-900">{completedTasks}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-1">In Progress</p>
            <p className="text-3xl font-bold text-gray-900">{inProgressTasks}</p>
          </div>

          
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  filterStatus === 'all' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Tasks
              </button>
              <button 
                onClick={() => setFilterStatus('active')}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  filterStatus === 'active' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                  filterStatus === 'completed' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed
              </button>
              <button 
                onClick={fetchAllTasks}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-1 flex items-center">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                />
              </div>
              <div className="col-span-4">
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Title</span>
              </div>
              <div className="col-span-5">
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Description</span>
              </div>
               <div className="col-span-2 text-center">
                   <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Status</span>
                </div>
              <div className="col-span-2">
                <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Actions</span>
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="divide-y divide-gray-100">
            {filteredTasks.map((task) => (
              <div 
                key={task.id} 
                className={`px-6 py-4 hover:bg-blue-50 transition-all duration-200 group ${
                  task.completed ? 'bg-green-50/30' : ''
                }`}
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1 flex items-center">
                    <input 
                      type="checkbox" 
                      checked={task.completed || false}
                      onChange={() => handleToggleComplete(task.id)}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all" 
                    />
                  </div>
                  <div className="col-span-4">
                    <h3 className="font-semibold text-gray-900 text-base">
                      {task.title}
                    </h3>
                  </div>
                  <div className="col-span-5">
                    <p className="text-sm text-gray-600">
                      {task.description || 'No description'}
                    </p>
                  </div>

                    <div className="col-span-2 flex justify-center">
                    <button
                      onClick={() => handleToggleComplete(task.id)}
                      className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 ${
                        task.completed
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-red-100 text-red-700 hover:bg-red-200'
                      }`}
                    >
                      {task.completed ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Completed</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Pending</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button 
                        onClick={() => openEditModal(task)}
                        className="p-2 hover:bg-blue-100 rounded-lg transition-all duration-200 group/btn"
                        title="Edit task"
                      >
                        <Edit2 className="w-4 h-4 text-blue-600 group-hover/btn:scale-110 transition-transform" />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 hover:bg-red-100 rounded-lg transition-all duration-200 group/btn"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center mt-6">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-medium">No tasks found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-600 font-medium">
            Showing <span className="font-bold text-gray-900">{filteredTasks.length}</span> of <span className="font-bold text-gray-900">{totalTasks}</span> tasks
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-md">
              1
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
              2
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
              3
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all">
              Next
            </button>
          </div>
        </div>
      </main>

      {/* Edit Task Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Task</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingTask(null);
                  setFormData({ title: '', description: '' });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Enter task description"
                />
              </div>

              <button
                onClick={handleEditTask}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Add New Task</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setFormData({ title: '', description: '' });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter task title"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  placeholder="Enter task description"
                />
              </div>

              <button
                onClick={handleAddTask}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Add Task</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

}