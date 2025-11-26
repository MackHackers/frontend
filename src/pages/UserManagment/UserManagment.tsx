import { useState, useEffect } from 'react';
import DocsHeader from '../../components/header/header.tsx';
import UserManagementSidebar from './components/UserManagementSidebar.tsx';
import UserEditor from './components/UserEditor.tsx';
import { userManagementService, type User, type CreateUserData, type UpdateUserData } from '../../api/userManagementService.ts';
import { userService } from '../../api/userService';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [userRole, setUserRole] = useState<string>('viewer');
    const [mode, setMode] = useState<'view' | 'edit' | 'create'>('view');
    const navigate = useNavigate();

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                const role = await userService.getUserRole();
                setUserRole(role);

                if (!['manager', 'root'].includes(role)) {
                    navigate('/docs');
                    return;
                }

                const usersData = await userManagementService.getAllUsers();
                console.log("users data:")
                console.log(usersData)
                setUsers(usersData);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [navigate]);

    const handleUserSelect = (user: User) => {
        setSelectedUser(user);
        setMode('view');
    };

    const handleEdit = () => {
        if (selectedUser) {
            setMode('edit');
        }
    };

    const handleCreate = () => {
        setSelectedUser(null);
        setMode('create');
    };

    const handleSave = async (data: CreateUserData | UpdateUserData) => {
        try {
            if (mode === 'create') {
                const newUser = await userManagementService.createUser(data as CreateUserData);
                setUsers(prev => [...prev, newUser]);
                setSelectedUser(newUser);
                setMode('view');
            } 
            // if (mode === 'edit' && selectedUser) {
            //     const updatedUser = await userManagementService.updateUser(selectedUser.id, data as UpdateUserData);
            //     setUsers(prev => prev.map(user =>
            //         user.id === selectedUser.id ? updatedUser : user
            //     ));
            //     setSelectedUser(updatedUser);
            //     setMode('view');
            // }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Ошибка при сохранении пользователя');
        }
    };

    const handleDelete = async () => {
        if (!selectedUser) return;

        const currentUser = await userService.getCurrentUser();
        if (selectedUser.id === currentUser?.username) {
            alert('Нельзя удалить собственный аккаунт');
            return;
        }

        if (window.confirm(`Вы уверены, что хотите удалить пользователя "${selectedUser.username}"?`)) {
            try {
                await userManagementService.deleteUser(selectedUser.id);
                setUsers(prev => prev.filter(user => user.id !== selectedUser.id));
                setSelectedUser(null);
                setMode('view');
            } catch (error) {
                console.error('Error deleting user:', error);
                alert('Ошибка при удалении пользователя');
            }
        }
    };

    const handleCancel = () => {
        if (mode === 'create') {
            setSelectedUser(null);
        }
        setMode('view');
    };

    if (loading) {
        return (
            <div className="user-management-layout">
                <DocsHeader />
                <div className="loading-container">Загрузка...</div>
            </div>
        );
    }

    return (
        <div className="user-management-layout">
            <DocsHeader />
            <div className="user-management-container">
                <UserManagementSidebar
                    users={users}
                    onUserSelect={handleUserSelect}
                    selectedUserId={selectedUser?.id}
                    onCreateNew={handleCreate}
                    currentUserRole={userRole}
                />

                <div className="user-management-content">
                    <UserEditor
                        user={selectedUser}
                        mode={mode}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        userRole={userRole}
                        currentUserId={selectedUser?.id}
                    />
                </div>
            </div>
        </div>
    );
};

export default UserManagement;