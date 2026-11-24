import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchAllNewspapers, updateNewspaper, addNewspaper } from '@/lib/features/newspaper/newspaperThunks';
import { RootState } from '@/lib/store';
import { Edit, Plus, SearchX } from 'lucide-react';
import EditModal from './EditModal';
import AddNewspaperModal from './AddNewspaperModal';
import SettingsPagination from './SettingsPagination';
import SettingsToolbar from './SettingsToolbar';
import { INewspaper } from '@/interfaces/newspaper';
import { useLocale, useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import { formatDate } from '@/utils/formatDateAndTime';
import Spinner from '@/components/ui/Spinner';

const NewspapersTable = () => {
  const t = useTranslations("SettingsPage.NewspapersPage")
  const tf = useTranslations("SettingsPage.filters");
  const locale = useLocale();

  const dispatch = useAppDispatch();
  const { allNewspapers, allNewspapersStatus, updateNewspaperStatus, addNewspaperStatus } = useAppSelector((state: RootState) => state.newspapers);
  const { loggedInUser: { token } } = useAppSelector((state: RootState) => state.authUser);
  const [editingNewspaper, setEditingNewspaper] = useState<INewspaper | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [search, setSearch] = useState('');
  const [monitoringFilter, setMonitoringFilter] = useState<'all' | 'withNews'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'nameAsc' | 'nameDesc'>('newest');

  useEffect(() => {
    if (allNewspapersStatus !== 'succeeded') dispatch(fetchAllNewspapers());
  }, [dispatch]);

  const filteredNewspapers = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = allNewspapers.filter((newspaper) => {
      const matchesSearch = !term || newspaper.name?.toLowerCase().includes(term);
      const matchesFilter = monitoringFilter === 'all' || (newspaper.newsMonitoringCount || 0) > 0;
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
  }, [allNewspapers, search, monitoringFilter, sortBy, locale]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, monitoringFilter, sortBy]);

  const isFiltered = search.trim() !== '' || monitoringFilter !== 'all';

  // Calculate pagination
  const totalPages = Math.ceil(filteredNewspapers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentNewspapers = filteredNewspapers.slice(startIndex, endIndex);

  const handleSave = async (newValue: string) => {
    try {
      if (updateNewspaperStatus === 'loading') return null;
      const action = await dispatch(updateNewspaper({ token, newspaperId: editingNewspaper?._id as string, data: { name: newValue } }))
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message)
        setEditingNewspaper(null)
      } else {
        toast.error(message)
      }
    } catch (err) {
      toast.error("فشلت عملية تحديث الصحيفة")
    }
  };

  const handleAddNewspaper = async (newspaperName: string) => {
    try {
      if (addNewspaperStatus === 'loading') return null;
      const action = await dispatch(addNewspaper({ token, data: { name: newspaperName } }))
      const { success, message } = action.payload as any;
      if (success) {
        toast.success(message || 'تم إضافة الصحيفة بنجاح')
        setIsAddModalOpen(false)
      } else {
        toast.error(message || 'فشلت عملية إضافة الصحيفة')
      }
    } catch (err) {
      toast.error("فشلت عملية إضافة الصحيفة")
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex gap-1 justify-between items-center mb-4 px-2">
        <h2 className="text-lg lg:text-xl font-semibold text-primary">
          {t("totalShowedNewspapers")}: <strong className='text-secondary'>{filteredNewspapers.length}</strong>
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="text-base inline-flex items-center gap-1 px-1 lg:px-4 py-2 bg-secondary text-white rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus size={16} />
          {t("addNewspaper")}
        </button>
      </div>

      <SettingsToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={tf("searchPlaceholder")}
        filters={[
          {
            value: monitoringFilter,
            onChange: (value) => setMonitoringFilter(value as 'all' | 'withNews'),
            ariaLabel: tf("filterBy"),
            options: [
              { value: 'all', label: tf("allRecords") },
              { value: 'withNews', label: tf("withNewsMonitoring") },
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

      {allNewspapersStatus === 'loading' &&
        <div
          className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg"
          style={{ minHeight: `calc(100vh - 120px)` }}
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
            <Spinner size="100px" />
          </div>
          <div className="text-xl font-semibold mb-2 text-primary">{t("loadingData")}</div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{t("fetchingFromDatabase")}</span>
          </div>
        </div>
      }

      {currentNewspapers.length === 0 && allNewspapersStatus !== 'loading' &&
        <div
          className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg"
          style={{ minHeight: `calc(100vh - 200px)` }}
        >
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-full">
            <SearchX className="w-8 h-8 text-gray-400" />
          </div>
          <div className="text-xl font-semibold mb-2 text-primary">{t("noDataFound")}</div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{t("tryAdjustingFilters")}</span>
          </div>
        </div>
      }

      {currentNewspapers && currentNewspapers.length > 0 &&
        <table className={`${locale === 'en' ? 'text-left' : 'text-right'} w-full text-xs`}>
          <thead className="text-xs text-primary uppercase bg-primary/20">
            <tr>
              <th scope="col" className="px-3 py-2">{t("newspaperName")}</th>
              <th scope="col" className="px-3 py-2">{t("totalNewsMonitoringCount")}</th>
              <th scope="col" className="px-3 py-2">{t("newspaperCreatedAt")}</th>
              <th scope="col" className="px-3 py-2">{t("edit")}</th>
            </tr>
          </thead>
          <tbody>
            {currentNewspapers.map((newspaper) => (
              <tr key={newspaper._id} className="border-b hover:bg-gray-200">
                <th scope="row" className="px-3 py-2 font-medium text-gray-900">{newspaper.name}</th>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {newspaper?.newsMonitoringCount?.toLocaleString() || 0}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span className="inline-flex items-center rounded-full text-xs font-medium">
                    {formatDate({ locale: 'ar', date: newspaper.createdAt, withTime: true })}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => setEditingNewspaper(newspaper)}
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
        totalItems={filteredNewspapers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />

      {editingNewspaper && <EditModal
        isOpen={!!editingNewspaper}
        onClose={() => setEditingNewspaper(null)}
        onSave={handleSave}
        title={t("editModalTitle")}
        value={editingNewspaper?.name || ''}
        label={t("newspaperName")}
      />}

      <AddNewspaperModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddNewspaper}
        isLoading={addNewspaperStatus === 'loading'}
      />
    </>
  );
};

export default NewspapersTable;
