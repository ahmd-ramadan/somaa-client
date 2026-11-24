import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllSectors, updateSector, addSector } from '@/lib/features/sector/sectorThunks';
import { RootState } from '@/lib/store';
import { Edit, FilterX, Plus, SearchX } from 'lucide-react';
import EditModal from './EditModal';
import AddSectorModal from './AddSectorModal';
import SettingsPagination from './SettingsPagination';
import SettingsToolbar from './SettingsToolbar';
import { ISector } from '@/interfaces/sector.types';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatDateAndTime';
import Spinner from '@/components/ui/Spinner';

const SectorsTable = () => {
  const t = useTranslations("SettingsPage.SectorsPage")
  const tf = useTranslations("SettingsPage.filters");
  const locale = useLocale();

  const dispatch = useAppDispatch();
  const { allSectors, allSectorsStatus, updateSectorStatus, addSectorStatus } = useAppSelector((state: RootState) => state.sectors);
  const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
  const [editingSector, setEditingSector] = useState<ISector | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState('');
  const [monitoringFilter, setMonitoringFilter] = useState<'all' | 'social' | 'news'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'nameAsc' | 'nameDesc'>('newest');

  useEffect(() => {
    if(allSectorsStatus !== 'succeeded') dispatch(fetchAllSectors());
  }, [dispatch]);

  const filteredSectors = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = allSectors.filter((sector) => {
      const matchesSearch = !term || sector.name?.toLowerCase().includes(term);
      const matchesFilter = monitoringFilter === 'all'
        || (monitoringFilter === 'social' ? (sector.socialMediaMonitoringCount || 0) > 0 : (sector.newsMonitoringCount || 0) > 0);
      return matchesSearch && matchesFilter;
    });

    return [...list].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'nameAsc':
          return (a.name || '').localeCompare(b.name || '', locale === 'en' ? 'en' : 'ar');
        case 'nameDesc':
          return (b.name || '').localeCompare(a.name || '', locale === 'en' ? 'en' : 'ar');
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [allSectors, search, monitoringFilter, sortBy, locale]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, monitoringFilter, sortBy]);

  const isFiltered = search.trim() !== '' || monitoringFilter !== 'all';

  // Calculate pagination
  const totalPages = Math.ceil(filteredSectors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSectors = filteredSectors.slice(startIndex, endIndex);

  const handleEdit = (sector: ISector) => {
    setEditingSector(sector);
  };

  const handleSave = async (newValue: string) => {

    try {
      if(updateSectorStatus === 'loading') return null;
      const action = await dispatch(updateSector({ token, sectorId: editingSector?._id as string, data: { name: newValue }})) 
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message)
        setEditingSector(null)
      } else {
        toast.error(message)
      }
    } catch(err) {
      toast.error("فشلت عملية  تحديث القطاع")
    }
  };

  const handleAddSector = async (sectorName: string) => {
    try {
      if(addSectorStatus === 'loading') return null;
      const action = await dispatch(addSector({ token, data: { name: sectorName }}))
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message || 'تم إضافة القطاع بنجاح')
        setIsAddModalOpen(false)
      } else {
        toast.error(message || 'فشلت عملية إضافة القطاع')
      }
    } catch(err) {
      toast.error("فشلت عملية إضافة القطاع")
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex gap-1 justify-between items-center mb-4 px-2">
        <h2 className="text-lg lg:text-xl font-semibold text-primary">
         {t("totalShowedSectors")}: <strong className='text-secondary'>{filteredSectors.length}</strong>
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="text-base inline-flex items-center gap-1 px-1 lg:px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          { t("addSector") }
        </button>
      </div>

      <SettingsToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={tf("searchPlaceholder")}
        filters={[
          {
            value: monitoringFilter,
            onChange: (value) => setMonitoringFilter(value as 'all' | 'social' | 'news'),
            ariaLabel: tf("filterBy"),
            options: [
              { value: 'all', label: tf("allRecords") },
              { value: 'social', label: tf("withSocialMonitoring") },
              { value: 'news', label: tf("withNewsMonitoring") },
            ],
          },
        ]}
        sort={{
          value: sortBy,
          onChange: (value) => setSortBy(value as 'newest' | 'oldest' | 'nameAsc' | 'nameDesc'),
          ariaLabel: tf("sortBy"),
          options: [
            { value: 'newest', label: tf("newestFirst") },
            { value: 'oldest', label: tf("oldestFirst") },
            { value: 'nameAsc', label: tf("nameAsc") },
            { value: 'nameDesc', label: tf("nameDesc") },
          ],
        }}
        isDirty={isFiltered}
        onClear={() => {
          setSearch('');
          setMonitoringFilter('all');
        }}
        clearLabel={tf("clear")}
      />

      { allSectorsStatus === 'loading' && 
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

      { currentSectors.length === 0 &&
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

      { currentSectors && currentSectors.length > 0 && 
        <table className={`${locale === 'en' ? 'text-left' : 'text-right'} w-full text-xs`}>
        <thead className="text-xs text-primary uppercase bg-primary/20">
          <tr>
            <th scope="col" className="px-3 py-2">{t("sectorName")}</th>
            <th scope="col" className="px-3 py-2">{t("totalSocialMediaMonitoringCount")}</th>
            <th scope="col" className="px-3 py-2">{t("totalNewsMonitoringCount")}</th>
            <th scope="col" className="px-3 py-2">{t("sectorCreatedAt")}</th>
            <th scope="col" className="px-3 py-2">{t("edit")}</th>
          </tr>
        </thead>
        <tbody>
          { currentSectors.map((sector, idx) => (
              <tr key={sector._id} className="border-b hover:bg-gray-200">
                <th scope="row" className="px-3 py-2 font-medium text-gray-900">{sector.name}</th>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {sector?.socialMediaMonitoringCount?.toLocaleString() || 0}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {sector?.newsMonitoringCount?.toLocaleString() || 0 }
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {formatDate({ locale: 'ar', date: sector.createdAt, withTime:  true })}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button 
                    onClick={() => setEditingSector(sector)}
                    className="inline-flex items-center gap-1 text-secondary hover:text-primary transition-colors"
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
        totalItems={filteredSectors.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      { editingSector && <EditModal
        isOpen={!!editingSector}
        onClose={() => setEditingSector(null)}
        onSave={handleSave}
        title={t("editModalTitle")}
        value={editingSector?.name || ''}
        label={t("sectorName")}
      /> }

      <AddSectorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddSector}
        isLoading={addSectorStatus === 'loading'}
      />
    </>
  );
};

export default SectorsTable; 