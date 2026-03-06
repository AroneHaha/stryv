"use client";

import { useState, useMemo } from "react";
import { Plus, Search, ChevronDown } from "lucide-react";
import { Member, MemberFormData } from '../../types/member';
import { STORAGE_KEYS } from '../../lib/constants';
import { getInitialData, isExpired, getPhilippinesDate, calculateMembershipPrice, calculateExpirationDate } from '../../lib/utils';
import { 
  MemberTable, 
  MemberAddModal, 
  MemberViewModal, 
  MemberEditModal, 
  MemberRenewModal 
} from '../../components/members';

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(() => getInitialData(STORAGE_KEYS.MEMBERS) as Member[]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter States
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterPlan, setFilterPlan] = useState("All");
  const [filterStatus, setFilterStatus] = useState("Active");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Form State for Edit
  const [editFormData, setEditFormData] = useState<MemberFormData>({
    firstName: "",
    lastName: "",
    email: "",
    birthdate: "",
    plan: "6 Months",
    customerType: "Regular",
    paymentMethod: "Cash"
  });

  // Handle Add Member
  const handleAddMember = (newMember: Member) => {
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updatedMembers));
  };

  // Handle View Member
  const handleViewMember = (member: Member) => {
    setSelectedMember(member);
    setIsViewModalOpen(true);
  };

  // Handle Edit Member
  const handleEditMember = (member: Member) => {
    setSelectedMember(member);
    setEditFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email || "",
      birthdate: member.birthdate || "",
      plan: member.plan,
      customerType: member.customerType,
      paymentMethod: member.paymentMethod
    });
    setIsEditModalOpen(true);
  };

  // Handle Save Edit
  const handleSaveEdit = (data: MemberFormData) => {
    if (!selectedMember) return;

    const price = calculateMembershipPrice(data.plan, data.customerType);

    const updatedMembers = members.map(m => {
      if (m.id === selectedMember.id) {
        return {
          ...m,
          firstName: data.firstName,
          lastName: data.lastName,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          birthdate: data.birthdate,
          plan: data.plan,
          customerType: data.customerType,
          paymentMethod: data.paymentMethod,
          price
        };
      }
      return m;
    });

    setMembers(updatedMembers);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updatedMembers));
    setIsEditModalOpen(false);
  };

  // Handle Renew Member
  const handleRenewMember = (plan: '6 Months' | '1 Year') => {
    if (!selectedMember) return;
    
    const today = new Date(getPhilippinesDate());
    const newExpiration = calculateExpirationDate(today, plan);
    const price = calculateMembershipPrice(plan, selectedMember.customerType);

    const updatedMembers = members.map(m => {
      if (m.id === selectedMember.id) {
        return {
          ...m,
          plan,
          price,
          startDate: today.toISOString().split('T')[0],
          expirationDate: newExpiration.toISOString().split('T')[0],
          status: 'Active' as const
        };
      }
      return m;
    });

    setMembers(updatedMembers);
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(updatedMembers));
    
    setSelectedMember({
      ...selectedMember,
      plan,
      price,
      startDate: today.toISOString().split('T')[0],
      expirationDate: newExpiration.toISOString().split('T')[0],
      status: 'Active'
    });
    
    setIsRenewModalOpen(false);
  };

  // Filter Logic
  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === "All" ? true : member.customerType === filterCategory;
      const matchesPlan = filterPlan === "All" ? true : member.plan === filterPlan;
      
      // Status filter
      let matchesStatus = true;
      if (filterStatus === "Active") {
        matchesStatus = !isExpired(member.expirationDate);
      } else if (filterStatus === "Expired") {
        matchesStatus = isExpired(member.expirationDate);
      }
      
      return matchesSearch && matchesCategory && matchesPlan && matchesStatus;
    });
  }, [members, searchTerm, filterCategory, filterPlan, filterStatus]);

  // Get existing usernames for duplicate check
  const existingUsernames = useMemo(() => members.map(m => m.username), [members]);

  return (
    <div className="flex flex-col h-full w-full gap-3 sm:gap-4 p-3 sm:p-4 bg-zinc-950 overflow-hidden">
      
      {/* Header & Search/Filter Actions */}
      <div className="flex flex-col gap-3 sm:gap-4 flex-shrink-0">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Members</h1>
            <p className="text-zinc-400 mt-0.5 sm:mt-1 text-xs sm:text-sm">Manage gym memberships and access credentials.</p>
          </div>
          
          {/* Add Member Button */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg text-sm font-bold tracking-wider transition-all shadow-[0_4px_14px_0_rgba(200,0,0,0)] hover:shadow-[0_6px_20px_0_rgba(200,0,0,0.3)]"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        </div>

        {/* Search & Filters Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search members..."
              className="w-full bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-red-600/20 focus:border-red-600 placeholder-zinc-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters Container */}
          <div className="flex items-center gap-2">
            {/* Status Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-28 justify-between"
              >
                <span className="truncate">{filterStatus}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showStatusDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1">
                  <button onClick={() => { setFilterStatus('Active'); setShowStatusDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Active</button>
                  <button onClick={() => { setFilterStatus('Expired'); setShowStatusDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Expired</button>
                  <button onClick={() => { setFilterStatus('All'); setShowStatusDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">All</button>
                </div>
              )}
            </div>

            {/* Category Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-32 justify-between"
              >
                <span className="truncate">{filterCategory === 'All' ? 'Category' : filterCategory}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1">
                  <button onClick={() => { setFilterCategory('All'); setShowCategoryDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">All Members</button>
                  <button onClick={() => { setFilterCategory('Regular'); setShowCategoryDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Regulars</button>
                  <button onClick={() => { setFilterCategory('Student'); setShowCategoryDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">Students</button>
                </div>
              )}
            </div>

            {/* Plan Filter */}
            <div className="relative flex-1 sm:flex-initial">
              <button 
                onClick={() => setShowPlanDropdown(!showPlanDropdown)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-zinc-400 hover:text-white transition-colors w-full sm:w-32 justify-between"
              >
                <span className="truncate">{filterPlan === 'All' ? 'Plan' : filterPlan}</span>
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              </button>
              {showPlanDropdown && (
                <div className="absolute top-full left-0 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-2 z-10 mt-1">
                  <button onClick={() => { setFilterPlan('All'); setShowPlanDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">All Plans</button>
                  <button onClick={() => { setFilterPlan('6 Months'); setShowPlanDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">6 Months</button>
                  <button onClick={() => { setFilterPlan('1 Year'); setShowPlanDropdown(false); }} className="block w-full text-left px-3 py-1.5 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-colors">1 Year</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <div className="flex-1 min-h-0 rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
        <MemberTable 
          members={filteredMembers}
          onView={handleViewMember}
          onEdit={handleEditMember}
        />
      </div>

      {/* Add Member Modal */}
      <MemberAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddMember}
        existingUsernames={existingUsernames}
      />

      {/* View Member Modal */}
      <MemberViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        member={selectedMember}
        onEdit={handleEditMember}
        onRenew={() => setIsRenewModalOpen(true)}
      />

      {/* Edit Member Modal */}
      <MemberEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        member={selectedMember}
        formData={editFormData}
        onFormDataChange={setEditFormData}
      />

      {/* Renew Membership Modal */}
      <MemberRenewModal
        isOpen={isRenewModalOpen}
        onClose={() => setIsRenewModalOpen(false)}
        onRenew={handleRenewMember}
        member={selectedMember}
      />
    </div>
  );
}