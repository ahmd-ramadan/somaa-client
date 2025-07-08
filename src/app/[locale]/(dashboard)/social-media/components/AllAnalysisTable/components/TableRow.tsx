import React from 'react';
import { IAnalysis } from '@/interfaces/analysis.types';
import { CircleUserRound, Edit, Trash2, Eye as EyeIcon } from 'lucide-react';

interface TableRowProps {
  analysis: IAnalysis;
  selectedItems: Set<string>;
  handleItemSelect: (itemId: string) => void;
  openDetailsModal: (analysis: IAnalysis) => void;
  openDeleteModal: (analysis: IAnalysis) => void;
  openViewModal: (analysis: IAnalysis) => void;
  role: string;
  permissions: any;
  userId: string;
  t: (key: string) => string;
}

const TableRow: React.FC<TableRowProps> = ({
  analysis,
  selectedItems,
  handleItemSelect,
  openDetailsModal,
  openDeleteModal,
  openViewModal,
  role,
  permissions,
  userId,
  t
}) => {
  const {
    _id,
    subAnalysisData,
    classify,
    content,
    createdAt,
    platform,
    publisher,
    sectorData,
    statistics: { reactions, comments, shares, views },
    url,
    addedBy,
    addedByData,
  } = analysis;

  return (
    <tr className="hover:bg-primary/20">
      <td className="px-2 py-1">
        <input
          type="checkbox"
          checked={selectedItems.has(_id)}
          onChange={() => handleItemSelect(_id)}
        />
      </td>
      <td className="px-2 py-1">
        <a href={url} className="text-secondary font-semibold underline" target="_blank" rel="noopener noreferrer">
          {t(platform)}
        </a>
      </td>
      <td className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap flex justify-start gap-2 items-center">
        <img
          src={publisher?.avatar || '/logo.png'}
          alt="Publisher avatar"
          className="h-10 w-10 rounded-md"
        />
        <div className='flex flex-col justify-start items-start gap-1'>
          <p className="text-sm font-semibold">{publisher?.name}</p>
          <p className="text-xs text-gray-600">@{publisher?.handle}</p>
        </div>
      </td>
      <td className="px-2 py-1">{sectorData?.name}</td>
      <td className={`px-2 py-1 ${classify === 'POSITIVE' ? 'text-green-600' : classify === 'NEGATIVE' ? 'text-red-600' : 'text-primary'}`}>{t(classify)}</td>
      <td className="px-2 py-1">{subAnalysisData?.body}</td>
      <td className="px-2 py-1">{reactions?.toLocaleString()}</td>
      <td className="px-2 py-1">{comments?.toLocaleString()}</td>
      <td className="px-2 py-1">{shares?.toLocaleString()}</td>
      <td className="px-2 py-1">{views?.toLocaleString()}</td>
      <td className="px-2 py-1">{((reactions || 0) + (comments || 0) + (shares || 0)).toLocaleString()}</td>
      <td className="px-2 py-1 w-fit">{new Date(createdAt).toLocaleString()}</td>
      <td className="px-2 py-1 font-medium text-gray-900">
        <div className="flex h-full justify-center items-center gap-1 whitespace-nowrap">
          <CircleUserRound className='w-4 h-4 text-primary'/>
          <p className="text-xs">{addedByData?.name}</p>
        </div>
      </td>
      <td className="px-2 py-1">
        <div className="flex items-center gap-2">
          {(role === 'super_admin' || addedBy?.toString() === userId?.toString()) ? (
            <>
              <Edit
                className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
                onClick={() => openDetailsModal(analysis)}
              />
              <Trash2
                className="w-5 h-5 text-red-500 hover:bg-red-500 hover:text-white rounded-md cursor-pointer p-1"
                onClick={() => openDeleteModal(analysis)}
              />
            </>
          ) : (
            <EyeIcon
              className="w-5 h-5 text-adminPrimary hover:bg-adminPrimary hover:text-white rounded-md cursor-pointer p-1"
              onClick={() => openViewModal(analysis)}
            />
          )}
        </div>
      </td>
    </tr>
  );
};

export default TableRow;