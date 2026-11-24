import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllSubAnalysis, updateSubAnalysis, addSubAnalysis } from '@/lib/features/subAnalysis/subAnalysisThunks';
import { RootState } from '@/lib/store';
import { Edit, Plus, SearchX } from 'lucide-react';
import EditModal from './EditModal';
import AddSubAnalysisModal from './AddSubAnalysisModal';
import SettingsPagination from './SettingsPagination';
import SettingsToolbar from './SettingsToolbar';
import { ISubAnalysis } from '@/interfaces/subAnalysis.types';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatDateAndTime';
import Spinner from '@/components/ui/Spinner';

const SubAnalysisTable = () => {
  const t = useTranslations("SettingsPage.SubAnalysisPage");
  const tf = useTranslations("SettingsPage.filters");

  const dispatch = useAppDispatch();
  const locale = useLocale();
  const { allSubAnalysis, allSubAnalysisStatus, updateSubAnalysisStatus, addSubAnalysisStatus } = useAppSelector((state: RootState) => state.subAnalysis);
  const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
  const [editingAnalysis, setEditingAnalysis] = useState<ISubAnalysis | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState('');
  const [monitoringFilter, setMonitoringFilter] = useState<'all' | 'withMentions'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostMentions'>('newest');

  useEffect(() => {
    if(allSubAnalysisStatus !== 'succeeded') dispatch(fetchAllSubAnalysis());
  }, [dispatch]);

  const filteredSubAnalysis = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = allSubAnalysis.filter((analysis) => {
      const matchesSearch = !term || analysis.body?.toLowerCase().includes(term);
      const matchesFilter = monitoringFilter === 'all' || (analysis.socialMediaMonitoringCount || 0) > 0;
      return matchesSearch && matchesFilter;
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'mostMentions':
          return (b.socialMediaMonitoringCount || 0) - (a.socialMediaMonitoringCount || 0);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [allSubAnalysis, search, monitoringFilter, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, monitoringFilter, sortBy]);

  const isFiltered = search.trim() !== '' || monitoringFilter !== 'all';

  // Calculate pagination
  const totalPages = Math.ceil(filteredSubAnalysis.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSubAnalysis = filteredSubAnalysis.slice(startIndex, endIndex);

  const handleEdit = (analysis: ISubAnalysis) => {
    setEditingAnalysis(analysis);
  };

  const handleSave = async (newValue: string) => {
    try {
      if(updateSubAnalysisStatus === 'loading') return null;
      const action = await dispatch(updateSubAnalysis({ token, subAnalysisId: editingAnalysis?._id as string, data: { body: newValue }})) 
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message)
        setEditingAnalysis(null)
      } else {
        toast.error(message)
      }
    } catch(err) {
      toast.error("فشلت عملية  تحديث التحليل")
    }
  };

  const handleAddSubAnalysis = async (analysisBody: string) => {
    try {
      if(addSubAnalysisStatus === 'loading') return null;
      const action = await dispatch(addSubAnalysis({ token, data: { body: analysisBody }}))
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message || 'تم إضافة التحليل بنجاح')
        setIsAddModalOpen(false)
      } else {
        toast.error(message || 'فشلت عملية إضافة التحليل')
      }
    } catch(err) {
      toast.error("فشلت عملية إضافة التحليل")
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='h-full'>
      <div className="flex gap-1 justify-between items-center mb-4 px-2">
        <h2 className="text-base lg:text-xl font-semibold text-primary">
         {t("totalShowedSubAnalysis")}: <strong className='text-secondary'>{filteredSubAnalysis.length}</strong>
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="text-base inline-flex items-center gap-1 px-1 lg:px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          { t("addSubAnalysis") }
        </button>
      </div>

      <SettingsToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={tf("searchPlaceholder")}
        filters={[
          {
            value: monitoringFilter,
            onChange: (value) => setMonitoringFilter(value as 'all' | 'withMentions'),
            ariaLabel: tf("filterBy"),
            options: [
              { value: 'all', label: tf("allRecords") },
              { value: 'withMentions', label: tf("withMentions") },
            ],
          },
        ]}
        sort={{
          value: sortBy,
          onChange: (value) => setSortBy(value as 'newest' | 'oldest' | 'mostMentions'),
          ariaLabel: tf("sortBy"),
          options: [
            { value: 'newest', label: tf("newestFirst") },
            { value: 'oldest', label: tf("oldestFirst") },
            { value: 'mostMentions', label: tf("mostMentions") },
          ],
        }}
        isDirty={isFiltered}
        onClear={() => {
          setSearch('');
          setMonitoringFilter('all');
        }}
        clearLabel={tf("clear")}
      />

      { allSubAnalysisStatus === 'loading' && 
        <div 
            className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg"
            style={{ minHeight: `calc(100vh - 120px)` }}    
        >
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <Spinner size="100px"/>
            </div>
            <div className="text-xl font-semibold mb-2 text-primary">{t("loadingData")}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{t("fetchingFromDatabase")}</span>
            </div>
        </div>
      }

      { currentSubAnalysis.length === 0 &&
        <div 
            className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg" 
            style={{ minHeight: `calc(100vh - 200px)` }}
        >
            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
                <SearchX className="w-8 h-8 text-gray-400" />
            </div>
            <div className="text-xl font-semibold mb-2 text-primary">{t("noDataFound")}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                {/* <FilterX className="w-4 h-4" /> */}
                <span>{t("tryAdjustingFilters")}</span>
            </div>
        </div>
      }

      { currentSubAnalysis && currentSubAnalysis.length > 0 && 
        <table className={`${locale === 'en' ? 'text-left' : 'text-right'} w-full h-full text-xs`}>
          <thead className="text-xs text-primary uppercase bg-primary/20">
            <tr>
              <th scope="col" className="px-3 py-2">{t("subAnalysisBody")}</th>
              <th scope="col" className="px-3 py-2">{t("totalSocialMediaMonitoringCount")}</th>
              <th scope="col" className="px-3 py-2">{t("subAnalysisCreatedAt")}</th>
              <th scope="col" className="px-3 py-2">{t("edit")}</th>
            </tr>
          </thead>
          <tbody>
            { currentSubAnalysis.map((subAnalysis, idx) => (
                <tr key={subAnalysis._id} className="border-b hover:bg-gray-200">
                  <th scope="row" className="px-3 py-2 font-medium text-gray-900">{subAnalysis.body}</th>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full text-xs font-medium">
                      {subAnalysis?.socialMediaMonitoringCount?.toLocaleString() || 0 }
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center rounded-full text-xs font-medium">
                      {formatDate({ locale: 'ar', date: subAnalysis.createdAt, withTime:  true })}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button 
                      onClick={() => handleEdit(subAnalysis)}
                      className="inline-flex items-center justify-center gap-1 text-secondary hover:text-primary transition-colors"
                    >
                      <Edit size={15} />
                      <span className="sr-only">تعديل</span>
                    </button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      }

      <SettingsPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredSubAnalysis.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      { editingAnalysis  && <EditModal
        isOpen={!!editingAnalysis}
        onClose={() => setEditingAnalysis(null)}
        onSave={handleSave}
        title={t("editModalTitle")}
        value={editingAnalysis?.body || ''}
        label={t("subAnalysisBody")}
      /> }

      <AddSubAnalysisModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSubAnalysis}
        isLoading={addSubAnalysisStatus === 'loading'}
      />
    </div>
  )
};

export default SubAnalysisTable; 