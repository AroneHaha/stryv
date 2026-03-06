"use client";

import { Eye, Edit, User, CheckCircle, AlertTriangle } from "lucide-react";
import { Member } from '../../types/member';
import { isExpired } from '../../lib/utils';

interface MemberTableProps {
  members: Member[];
  onView: (member: Member) => void;
  onEdit: (member: Member) => void;
}

export default function MemberTable({ members, onView, onEdit }: MemberTableProps) {
  return (
    <div className="overflow-x-auto h-full overflow-y-auto">
      <table className="w-full text-left min-w-[600px]">
        <thead className="bg-zinc-950 border-b border-zinc-800 sticky top-0">
          <tr>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Name</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Plan</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Joined/Renewed</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Expiration</th>
            <th className="px-3 sm:px-4 py-3 sm:py-4 text-xs font-bold text-zinc-500 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800">
          {members.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-3 sm:px-4 py-12 text-center text-zinc-500 text-sm">
                No members found.
              </td>
            </tr>
          ) : (
            members.map((member) => {
              const memberExpired = isExpired(member.expirationDate);
              
              return (
                <tr 
                  key={member.id} 
                  className="hover:bg-zinc-800/30 transition-colors group cursor-pointer"
                  onDoubleClick={() => onView(member)}
                >
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] sm:text-xs font-bold text-zinc-300 flex-shrink-0">
                        {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-white truncate leading-tight">{member.name}</p>
                        <p className="text-[10px] sm:text-xs text-zinc-500">{member.customerType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-col gap-1">
                      <span className="px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-[10px] sm:text-xs font-bold text-zinc-300 w-fit">
                        {member.plan}
                      </span>
                      <span className="text-[10px] sm:text-xs text-zinc-500">₱{member.price.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-500 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs text-zinc-400 font-medium whitespace-nowrap">{member.startDate}</span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] sm:text-xs text-zinc-400 font-medium whitespace-nowrap">{member.expirationDate}</span>
                      {memberExpired ? (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                          <AlertTriangle className="h-3 w-3" />
                          Expired
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-500">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <button 
                        onClick={() => onView(member)}
                        className="p-1 sm:p-1.5 text-zinc-500 hover:text-white transition-colors rounded hover:bg-zinc-800"
                      >
                        <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button 
                        onClick={() => onEdit(member)}
                        className="p-1 sm:p-1.5 text-zinc-500 hover:text-white transition-colors rounded hover:bg-zinc-800"
                      >
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}