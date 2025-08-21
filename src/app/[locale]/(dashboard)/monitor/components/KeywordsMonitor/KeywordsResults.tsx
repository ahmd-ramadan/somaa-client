'use client';

import React, { useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSelector } from 'react-redux';
import { IMonitorResult, PlatformsNamesEnum, MonitorSentimentsEnum, MonitorLanguagesEnum, GenderTypesEnum } from './types';
import { RootState } from '@/lib/store';
import TweetEmbed from 'react-tweet-embed';
import { FacebookEmbed, InstagramEmbed, LinkedInEmbed, YouTubeEmbed } from 'react-social-media-embed';
import { 
  Share2, 
  Heart, 
  MessageCircle, 
  Bookmark, 
  MoreHorizontal, 
  ExternalLink,
  Download,
  Copy,
  Globe,
  MessageSquare,
  User,
  Calendar,
  MapPin,
  CheckSquare
} from 'lucide-react';
import ResultsFiltersV2 from './ResultsFilters';
import ResultsTableView from './ResultsTableView';
import ExportControls from './ExportControls';
import GridView from './GridView';
import ListView from './ListView';

interface KeywordsResultsProps {
  dataSource?: string;
}

interface FilterState {
  platforms: PlatformsNamesEnum[];
  languages: MonitorLanguagesEnum[];
  sentiments: MonitorSentimentsEnum[];
  genders: GenderTypesEnum[];
  ageRanges: string[];
  hasLocation: boolean;
  hasMedia: boolean;
  verifiedOnly: boolean;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

export default function KeywordsResultsV2({ dataSource }: KeywordsResultsProps) {
  const t = useTranslations('Monitor.results');
  const { results, monitorByKeywordsStatus, total, currentFilters } = useSelector((state: RootState) => state.monitor);
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showGrouping, setShowGrouping] = useState(false);
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [gridColumns, setGridColumns] = useState(3); // New: Grid column control
  const [listDensity, setListDensity] = useState<'compact' | 'comfortable'>('comfortable'); // New: List density control

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    platforms: [],
    languages: [],
    sentiments: [],
    genders: [],
    ageRanges: [],
    hasLocation: false,
    hasMedia: false,
    verifiedOnly: false,
    dateRange: {
      start: null,
      end: null
    }
  });

  // Selection handlers
  const handleSelectResult = (resultId: string, selected: boolean) => {
    const newSelected = new Set(selectedResults);
    if (selected) {
      newSelected.add(resultId);
    } else {
      newSelected.delete(resultId);
    }
    setSelectedResults(newSelected);
  };

  const handleSelectAllInGroup = (results: IMonitorResult[], selected: boolean) => {
    const newSelected = new Set(selectedResults);
    results.forEach(result => {
      const resultId = result.url; // Use URL as unique identifier
      if (selected) {
        newSelected.add(resultId);
      } else {
        newSelected.delete(resultId);
      }
    });
    setSelectedResults(newSelected);
  };

  const handleSelectAll = () => {
    const allResultIds = results.map(result => result.url);
    setSelectedResults(new Set(allResultIds));
  };

  const handleClearSelection = () => {
    setSelectedResults(new Set());
  };

  const getSelectedResultsArray = () => {
    return results.filter(result => selectedResults.has(result.url));
  };

  // Filter and group results
  const filteredAndGroupedResults = useMemo(() => {
    let filtered = results.filter(result => {
      // Platform filter
      if (filters.platforms.length > 0 && !filters.platforms.includes(result.platform)) {
        return false;
      }

      // Language filter
      if (filters.languages.length > 0 && result.language && !filters.languages.includes(result.language)) {
        return false;
      }

      // Sentiment filter
      if (filters.sentiments.length > 0 && !filters.sentiments.includes(result.sentiment)) {
        return false;
      }

      // Gender filter
      if (filters.genders.length > 0 && result.author.gender && !filters.genders.includes(result.author.gender)) {
        return false;
      }

      // Age filter
      if (filters.ageRanges.length > 0 && result.author.age) {
        const age = result.author.age;
        const ageInRange = filters.ageRanges.some(range => {
          switch (range) {
            case '13-17': return age >= 13 && age <= 17;
            case '18-24': return age >= 18 && age <= 24;
            case '25-34': return age >= 25 && age <= 34;
            case '35-44': return age >= 35 && age <= 44;
            case '45+': return age >= 45;
            default: return false;
          }
        });
        if (!ageInRange) return false;
      }

      // Location filter
      if (filters.hasLocation && !result.location?.address) {
        return false;
      }

      // Media filter
      if (filters.hasMedia && result.content.images.length === 0 && result.content.videos.length === 0) {
        return false;
      }

      // Verified filter
      if (filters.verifiedOnly && !result.author.isVerified) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const publishDate = new Date(result.publishAt);
        if (filters.dateRange.start && publishDate < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && publishDate > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });

    // Multi-level grouping
    if (groupBy.length === 0) {
      return { 'All Results': filtered };
    }

    const grouped: Record<string, IMonitorResult[]> = {};
    
    filtered.forEach(result => {
      let groupKeys: string[] = [];
      
      groupBy.forEach(groupType => {
        let groupKey = '';
        
        switch (groupType) {
          case 'platform':
            groupKey = result.platform;
            break;
          case 'language':
            groupKey = result.language || 'Unknown';
            break;
          case 'sentiment':
            groupKey = result.sentiment;
            break;
          case 'gender':
            groupKey = result.author.gender || 'Unknown';
            break;
          case 'age':
            const age = result.author.age;
            if (age) {
              if (age < 18) groupKey = 'Under 18';
              else if (age < 25) groupKey = '18-24';
              else if (age < 35) groupKey = '25-34';
              else if (age < 45) groupKey = '35-44';
              else groupKey = '45+';
            } else {
              groupKey = 'Unknown';
            }
            break;
          case 'location':
            groupKey = result.location?.address ? 'Has Location' : 'No Location';
            break;
          case 'author':
            groupKey = result.author.name || result.author.handle;
            break;
        }
        
        groupKeys.push(groupKey);
      });
      
      const finalGroupKey = groupKeys.join(' > ');
      
      if (!grouped[finalGroupKey]) {
        grouped[finalGroupKey] = [];
      }
      grouped[finalGroupKey].push(result);
    });

    return grouped;
  }, [results, filters, groupBy]);

  // Flat filtered results for grid/list pagination
  const flatFilteredResults = useMemo(() => {
    return results.filter(result => {
      if (filters.platforms.length > 0 && !filters.platforms.includes(result.platform)) return false;
      if (filters.languages.length > 0 && result.language && !filters.languages.includes(result.language)) return false;
      if (filters.sentiments.length > 0 && !filters.sentiments.includes(result.sentiment)) return false;
      if (filters.genders.length > 0 && result.author.gender && !filters.genders.includes(result.author.gender)) return false;
      if (filters.ageRanges.length > 0 && result.author.age) {
        const age = result.author.age;
        const ageInRange = filters.ageRanges.some(range => {
          switch (range) {
            case '13-17': return age >= 13 && age <= 17;
            case '18-24': return age >= 18 && age <= 24;
            case '25-34': return age >= 25 && age <= 34;
            case '35-44': return age >= 35 && age <= 44;
            case '45+': return age >= 45;
            default: return false;
          }
        });
        if (!ageInRange) return false;
      }
      if (filters.hasLocation && !result.location?.address) return false;
      if (filters.hasMedia && result.content.images.length === 0 && result.content.videos.length === 0) return false;
      if (filters.verifiedOnly && !result.author.isVerified) return false;
      if (filters.dateRange.start || filters.dateRange.end) {
        const publishDate = new Date(result.publishAt);
        if (filters.dateRange.start && publishDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && publishDate > filters.dateRange.end) return false;
      }
      return true;
    });
  }, [results, filters]);

  const renderEmbdedPlatforms = (r: IMonitorResult) => {
    const { platform, url } = r;
    
    if (platform === PlatformsNamesEnum.X) {
      const match = url.split('/status/');
      const tweetId = match[1];
      return (
        <div className="h-[500px] w-[340px] overflow-auto custom-scrollbar">
          <TweetEmbed  tweetId={tweetId} options={{ theme: 'dark', align: 'center' }} className="w-full h-full overflow-auto custom-scrollbar" />
        </div>
      );
    }

    if (platform === PlatformsNamesEnum.TIKTOK) {
      // Try to extract the video ID from the URL
      const match = url.match(/video\/(\d+)/);
      const videoId = match ? match[1] : null;
      // Use a placeholder or TikTok's thumbnail API if available
      const thumbnail = videoId
        ? `https://www.tiktok.com/api/img/?itemId=${videoId}`
        : '/tiktok-placeholder.png';
  
      return (
        <div className="h-[500px] w-[340px] flex justify-center items-center overflow-auto custom-scrollbar">
          <iframe
            src={`https://www.tiktok.com/embed/v2/${videoId}`}
            // width="400"
            // height="700"
            allow="autoplay; encrypted-media"
            allowFullScreen
            className="w-full h-full rounded-lg"
          />
        </div>
      );
    }
  
    if (platform === PlatformsNamesEnum.YOUTUBE) {
      return (
        <div className="flex justify-center items-center overflow-auto custom-scrollbar">
          <YouTubeEmbed url={url}  className="w-full h-full overflow-auto custom-scrollbar" />
        </div>
      );
    }

    if (platform === PlatformsNamesEnum.REDDIT) {
      if (!r || !r.url || !r.content || !r.content.text) return null;

      // Extract subreddit information (assuming you have this)
      const match = r.url.match(/reddit\.com\/r\/([^\/]+)/);
      const subRedditName = match ? match[1] : 'unknown';
      const subRedditUrl = `https://www.reddit.com/r/${subRedditName}`;

      return (
        <div className="h-[600px] w-[400px] flex justify-center items-center overflow-auto">
          <blockquote className="reddit-card" data-card-created={new Date().getTime()}>
            <a href={`${r.url}?ref=share&ref_source=embed`} target="_blank" rel="noopener noreferrer">
              {r.content.text}
            </a>
            from 
            <a href={subRedditUrl} target="_blank" rel="noopener noreferrer">
              {subRedditName}
            </a>
          </blockquote>
          <script async src="//embed.redditmedia.com/widgets/platform.js"></script>
        </div>
      );
    }

    return null;
  }

  const renderHoverButtons = (postIndex: number) => {
    const buttons = [
      { icon: Heart, label: 'Like', color: 'bg-red-500 hover:bg-red-600' },
      { icon: MessageCircle, label: 'Comment', color: 'bg-blue-500 hover:bg-blue-600' },
      { icon: Share2, label: 'Share', color: 'bg-green-500 hover:bg-green-600' },
      { icon: Bookmark, label: 'Save', color: 'bg-purple-500 hover:bg-purple-600' },
      { icon: Download, label: 'Download', color: 'bg-orange-500 hover:bg-orange-600' },
      { icon: Copy, label: 'Copy', color: 'bg-gray-500 hover:bg-gray-600' },
      { icon: MoreHorizontal, label: 'More', color: 'bg-indigo-500 hover:bg-indigo-600' }
    ];

    return (
      <div className="absolute inset-0 flex items-center justify-center z-10">
        {/* Green rectangle base */}
        <div className="bg-green-500 rounded-lg px-4 py-2 shadow-lg">
          {/* Arc of yellow circular buttons */}
          <div className="relative flex items-center justify-center">
            {buttons.map((button, index) => {
              const Icon = button.icon;
              // Calculate position in arc
              const totalButtons = buttons.length;
              const angleStep = 120 / (totalButtons - 1); // 120 degree arc
              const angle = -60 + (index * angleStep); // Start from -60 degrees
              const radius = 80; // Distance from center
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <div
                  key={index}
                  className={`absolute w-10 h-10 rounded-full border-2 border-yellow-400 bg-yellow-300 flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:bg-yellow-200 ${button.color}`}
                  style={{
                    transform: `translate(${x}px, ${y}px)`,
                    zIndex: totalButtons - index
                  }}
                  title={button.label}
                >
                  <Icon className="w-4 h-4 text-white" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
  );
  };

  const allowedEmbededPlatforms = [
    PlatformsNamesEnum.TIKTOK, 
    PlatformsNamesEnum.X, 
    PlatformsNamesEnum.YOUTUBE, 
    // PlatformsNamesEnum.REDDIT
  ]

  function shuffle(arr: IMonitorResult[]) {
    // Random Results
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); 
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    // Make Youtube in last
    for (let i = 0, j = arr.length - 1; i < j; i ++) {
      if(arr[i].platform === PlatformsNamesEnum.YOUTUBE) {
        while(i < j) {
          if(arr[j].platform !== PlatformsNamesEnum.YOUTUBE) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            j --;
            break;
          }
          j --;
        }
      }
    }
    return arr.slice(0, 20);
  }

  if (monitorByKeywordsStatus === 'loading') {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">{t('loading')}</p>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  const totalFilteredResults = Object.values(filteredAndGroupedResults).reduce((acc, group) => acc + group.length, 0);

  // Get current locale
  const locale = useLocale();

  return (
    <div className="space-y-4">
      {/* Enhanced Filters */}
      <ResultsFiltersV2
        filters={filters}
        setFilters={setFilters}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        showGrouping={showGrouping}
        setShowGrouping={setShowGrouping}
        selectionMode={selectionMode}
        setSelectionMode={setSelectionMode}
        gridColumns={gridColumns}
        setGridColumns={setGridColumns}
        listDensity={listDensity}
        setListDensity={setListDensity}
        totalResults={results.length}
        filteredResults={totalFilteredResults}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        locale={locale}
      />

      {/* Export Controls */}
      {selectionMode && (
        <ExportControls
          selectedResults={getSelectedResultsArray()}
          locale={locale}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAll}
          totalResults={results.length}
        />
      )}

      {/* Selection Summary Bar */}
      {/* {selectionMode && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">
                  {t2('selectionMode', 'وضع التحديد', 'Selection Mode')} {t2('active', 'نشط', 'Active')}
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {selectedResults.size} {t2('of', 'من', 'of')} {results.length} {t2('results', 'نتيجة', 'results')} {t2('selected', 'محدد', 'selected')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
              >
                {t2('selectAll', 'تحديد الكل', 'Select All')}
              </button>
              <button
                onClick={handleClearSelection}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                {t2('clearSelection', 'مسح التحديد', 'Clear Selection')}
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Results */}
      {viewMode === 'table' ? (
        // Table View
        <ResultsTableView
          results={Object.values(filteredAndGroupedResults).flat()}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          locale={locale}
          selectedResults={selectedResults}
          onSelectResult={handleSelectResult}
          onSelectAllInPage={handleSelectAllInGroup}
          selectionMode={selectionMode}
          groupBy={groupBy}
          onSelectAllInGroup={handleSelectAllInGroup}
        />
      ) : viewMode === 'grid' ? (
        <GridView
          results={flatFilteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
          groupBy={groupBy}
          locale={locale}
          renderEmbdedPlatforms={renderEmbdedPlatforms}
          renderHoverButtons={renderHoverButtons}
          onHoverPost={setHoveredPost}
          hoveredPost={hoveredPost}
          allowedEmbededPlatforms={allowedEmbededPlatforms}
          shuffle={shuffle}
          selectedResults={selectedResults}
          onSelectResult={handleSelectResult}
          onSelectAllInGroup={handleSelectAllInGroup}
          selectionMode={selectionMode}
          gridColumns={gridColumns}
        />
      ) : (
        <ListView
          results={flatFilteredResults.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
          groupBy={groupBy}
          locale={locale}
          renderEmbdedPlatforms={renderEmbdedPlatforms}
          renderHoverButtons={renderHoverButtons}
          onHoverPost={setHoveredPost}
          hoveredPost={hoveredPost}
          allowedEmbededPlatforms={allowedEmbededPlatforms}
          shuffle={shuffle}
          selectedResults={selectedResults}
          onSelectResult={handleSelectResult}
          onSelectAllInGroup={handleSelectAllInGroup}
          selectionMode={selectionMode}
          listDensity={listDensity}
        />
      )}
    </div>
  );
} 