import React, { useState } from 'react';
import StaffList from './StaffList';
import AddStaff from './AddStaff';
import EditStaff from './EditStaff';
import SalaryManagement from './SalaryManagement';

const Staff = () => {
  const [view, setView] = useState('list');
  const [editingStaff, setEditingStaff] = useState(null);

  const handleAddStaff = () => {
    setView('add');
  };

  const handleEditStaff = (staff) => {
    setEditingStaff(staff);
    setView('edit');
  };

  const handleSalaryManagement = () => {
    setView('salary');
  };

  const handleBackToList = () => {
    setView('list');
    setEditingStaff(null);
  };

  const renderView = () => {
    switch (view) {
      case 'add':
        return <AddStaff onSuccess={handleBackToList} onBack={handleBackToList} />;
      case 'edit':
        return <EditStaff staff={editingStaff} onSuccess={handleBackToList} onBack={handleBackToList} />;
      case 'salary':
        return <SalaryManagement onBack={handleBackToList} />;
      default:
        return <StaffList onAdd={handleAddStaff} onEdit={handleEditStaff} onSalaryManagement={handleSalaryManagement} />;
    }
  };

  return (
    <div>
      {renderView()}
    </div>
  );
};

export default Staff;
