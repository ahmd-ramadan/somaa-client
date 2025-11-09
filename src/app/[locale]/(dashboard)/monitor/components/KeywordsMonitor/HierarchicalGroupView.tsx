'use client';

import React, { useState } from 'react';
import { IMonitorResult, PlatformsNamesEnum } from './types';
import { 
  ChevronDown, 
  ChevronRight, 
  Globe, 
  MessageSquare, 
  Heart, 
  User, 
  Calendar, 
  MapPin,
  Eye,
  ExternalLink,
  MapPin as MapPinIcon,
  CheckSquare,
  Square,
  Share2,
  Verified,
  Users,
  Bell,
  UserCheckIcon,
  UserCheck2,
  Share,
  ArrowBigUpIcon,
  Save,
  RectangleVertical,
  Quote,
  DownloadIcon,
  Bookmark
} from 'lucide-react';
import { getPlatformIcon, getProfileLink } from './utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface HierarchicalGroupViewProps {
  results: IMonitorResult[];
  groupBy: string[];
  viewMode: 'grid' | 'list' | 'table';
  locale: string;
  renderEmbdedPlatforms: (result: IMonitorResult) => React.ReactNode;
  renderHoverButtons: (postIndex: number) => React.ReactNode;
  onHoverPost: (index: number | null) => void;
  hoveredPost: number | null;
  allowedEmbededPlatforms: PlatformsNamesEnum[];
  shuffle: (arr: IMonitorResult[]) => IMonitorResult[];
  selectedResults: string[];
  onSelectResult: (resultId: string, selected: boolean) => void;
  onSelectAllInGroup: (results: IMonitorResult[], selected: boolean) => void;
  selectionMode: boolean;
  gridColumns: number;
  listDensity: 'compact' | 'comfortable';
}

interface GroupNode {
  key: string;
  label: string;
  icon: React.ComponentType<any>;
  results: IMonitorResult[];
  children: Record<string, GroupNode>;
  level: number;
  isExpanded: boolean;
}

export default function HierarchicalGroupView({
  results,
  groupBy,
  viewMode,
  locale,
  renderEmbdedPlatforms,
  renderHoverButtons,
  onHoverPost,
  hoveredPost,
  allowedEmbededPlatforms,
  shuffle,
  selectedResults,
  onSelectResult,
  onSelectAllInGroup,
  selectionMode,
  gridColumns,
  listDensity
}: HierarchicalGroupViewProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const t = useTranslations("Monitor.keywords.results")

  const [errorImages, setErrorImages] = useState<string[]>([])

  // Handle expand/collapse all events
  React.useEffect(() => {
    const handleExpandAll = () => {
      const allGroupKeys = getAllGroupKeys(results, groupBy);
      setExpandedGroups(new Set(allGroupKeys));
    };

    const handleCollapseAll = () => {
      setExpandedGroups(new Set());
    };

    window.addEventListener('expandAllGroups', handleExpandAll);
    window.addEventListener('collapseAllGroups', handleCollapseAll);

    return () => {
      window.removeEventListener('expandAllGroups', handleExpandAll);
      window.removeEventListener('collapseAllGroups', handleCollapseAll);
    };
  }, [results, groupBy]);

  // Helper function to get all group keys
  const getAllGroupKeys = (results: IMonitorResult[], groupBy: string[]): string[] => {
    const keys: string[] = [];
    
    const collectKeys = (results: IMonitorResult[], groupBy: string[], level: number = 0) => {
      if (groupBy.length === 0 || level >= groupBy.length) return;

      const currentGroupType = groupBy[level];
      const groups: Record<string, IMonitorResult[]> = {};

      results.forEach(result => {
        let groupKey = '';
        
        switch (currentGroupType) {
          case 'platform':
            groupKey = result.platform;
            break;
          case 'language':
            groupKey = result.language || 'unknown';
            break;
          case 'sentiment':
            groupKey = result.sentiment;
            break;
          case 'gender':
            groupKey = result.author.gender || 'unknown';
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
              groupKey = 'unknown';
            }
            break;
          case 'location':
            groupKey = result.location?.address ? 'Has Location' : 'No Location';
            break;
          case 'author':
            groupKey = result.author.name || result.author.handle;
            break;
        }

        if (!groups[groupKey]) {
          groups[groupKey] = [];
          keys.push(groupKey);
        }
        groups[groupKey].push(result);
      });

      // Recursively collect keys for children
      Object.values(groups).forEach(groupResults => {
        collectKeys(groupResults, groupBy, level + 1);
      });
    };

    collectKeys(results, groupBy);
    return keys;
  };

  const getGroupIcon = (groupType: string) => {
    switch (groupType) {
      case 'platform':
        return Globe;
      case 'language':
        return MessageSquare;
      case 'sentiment':
        return Heart;
      case 'gender':
      case 'author':
        return User;
      case 'age':
        return Calendar;
      case 'location':
        return MapPin;
      default:
        return Globe;
    }
  };

  const getGroupLabel = (groupType: string, value: string) => {
    switch (groupType) {
      case 'platform':
        return t(value);
      case 'language':
        return t(value);
      case 'sentiment':
        return t(value);
      case 'gender':
        return t(value);
      case 'age':
        return value;
      case 'location':
        return value === 'Has Location' ? t('hasLocation') : t('noLocation');
      case 'author':
        return value;
      default:
        return value;
    }
  };

  const buildHierarchicalGroups = (results: IMonitorResult[], groupBy: string[], level: number = 0): Record<string, GroupNode> => {
    if (groupBy.length === 0 || level >= groupBy.length) {
      return {};
    }

    const currentGroupType = groupBy[level];
    const groups: Record<string, GroupNode> = {};

    results.forEach(result => {
      let groupKey = '';
      
      switch (currentGroupType) {
        case 'platform':
          groupKey = result.platform;
          break;
        case 'language':
          groupKey = result.language || 'unknown';
          break;
        case 'sentiment':
          groupKey = result.sentiment;
          break;
        case 'gender':
          groupKey = result.author.gender || 'unknown';
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
            groupKey = 'unknown';
          }
          break;
        case 'location':
          groupKey = result.location?.address ? 'Has Location' : 'No Location';
          break;
        case 'author':
          groupKey = result.author.name || result.author.handle;
          break;
      }

      if (!groups[groupKey]) {
        const Icon = getGroupIcon(currentGroupType);
        groups[groupKey] = {
          key: groupKey,
          label: getGroupLabel(currentGroupType, groupKey),
          icon: Icon,
          results: [],
          children: {},
          level,
          isExpanded: false
        };
      }
      
      groups[groupKey].results.push(result);
    });

    // Build children for each group
    Object.values(groups).forEach(group => {
      if (level + 1 < groupBy.length) {
        group.children = buildHierarchicalGroups(group.results, groupBy, level + 1);
      }
    });

    return groups;
  };

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-600 bg-green-100';
      case 'negative':
        return 'text-red-600 bg-red-100';
      case 'neutral':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderGroupHeader = (group: GroupNode) => {
    const Icon = group.icon;
    const isExpanded = expandedGroups.has(group.key);
    const hasChildren = Object.keys(group.children).length > 0;
    const totalResults = group.results.length;
    const selectedInGroup = group.results.filter(r => selectedResults.includes(r.url)).length;
    const isAllSelected = selectedInGroup === totalResults && totalResults > 0;
    const isPartiallySelected = selectedInGroup > 0 && selectedInGroup < totalResults;

    // Different colors for different levels
    const levelColors = [
      'border-blue-500 bg-blue-50 hover:bg-blue-100',
      'border-green-500 bg-green-50 hover:bg-green-100',
      'border-purple-500 bg-purple-50 hover:bg-purple-100',
      'border-orange-500 bg-orange-50 hover:bg-orange-100',
      'border-pink-500 bg-pink-50 hover:bg-pink-100'
    ];

    const colorClass = levelColors[group.level] || levelColors[levelColors.length - 1];

    return (
      <div
        className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm cursor-pointer transition-colors border-l-4 ${colorClass}`}
        onClick={() => toggleGroup(group.key)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Selection checkbox for group */}
            {selectionMode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectAllInGroup(group.results, !isAllSelected);
                }}
                className="flex items-center justify-center w-5 h-5"
              >
                {isAllSelected ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : isPartiallySelected ? (
                  <div className="w-5 h-5 border-2 border-blue-600 bg-blue-100 rounded" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            )}

            {/* Expand/collapse button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleGroup(group.key);
              }}
              className="flex items-center justify-center w-4 h-4 hover:bg-gray-200 rounded"
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )
              ) : (
                <div className="w-4 h-4" />
              )}
            </button>

            <span className="font-semibold text-gray-900">
              {group.label}
            </span>
          </div>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            {selectedInGroup > 0 ? `${selectedInGroup}/${totalResults}` : totalResults} {t('results')}
          </span>
        </div>

        {hasChildren && (
          <div className="text-sm text-gray-500">
            {isExpanded ? '▼' : '▶'}
          </div>
        )}
      </div>
    );
  };

  const renderResults = (results: IMonitorResult[], groupKey: string) => {
    if (viewMode === 'list') {
      const densityClass = listDensity === 'compact' ? 'p-2' : 'p-4';
      return (
        <div className="space-y-2">
          {shuffle([...results]).map((r, idx) => {
            const isSelected = selectedResults.includes(r.url);
            return (
              <div
                key={`${groupKey}-${idx}`}
                className={`flex flex-col items-start gap-4 bg-white rounded-lg shadow-sm ${densityClass} ${isSelected ? 'ring-2 ring-secondary' : ''}`}
              >
                <div className='flex items-start justify-between w-full'>
                  <div className='flex items-start gap-1'>
                    {selectionMode && (
                      <button
                        onClick={() => onSelectResult(r.url, !isSelected)}
                        className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-white rounded shadow-sm"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    )}
                    <Link
                      href={getProfileLink({ platform: r.platform, handle: r.author.handle }) || ""} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className='flex items-center justify-start gap-2'
                    >
                      <div                
                        className="flex w-12 h-12 rounded-lg justify-center items-center bg-gray-100">
                        {!r.author.avatar || errorImages.includes(r.url) ?
                          getPlatformIcon({ platform: r.platform, className: `w-6 h-6 text-secondary` })
                        : 
                          <img 
                            src={r.author.avatar} 
                            alt={r.author.name[0]} 
                            className={`w-full h-full rounded-lg` }
                            onError={() => {
                              setErrorImages([... errorImages, r.url])
                            }}
                          />
                        }
                      </div>

                        <div className='flex flex-col gap-1'>
                          <div className='flex items-center gap-1'>
                            <span className="text-base font-semibold truncate hover:underline">{r.author.name}</span>
                            <span className="text-xs text-gray-500 truncate hover:underline">@{r.author.handle}</span>
                            <Verified  className='w-4 h-4 text-white fill-primary'/>
                          </div>
                          

                          <div className="flex gap-2 items-center text-xs text-gray-500 mt-1">
                            {r?.author?.followers ? <div className='flex gap-1  items-center text-xs text-gray-500' title={t("followers")}><Users className='text-secondary w-4 h-4' /> {r?.author?.followers}</div> : null}
                            {r?.author?.subscribers ? <div className='flex gap-1  items-center text-xs text-gray-500' title={t("subscribers")}><Bell className='text-secondary w-4 h-4'/> {r?.author?.subscribers}</div> : null}
                            {r?.author?.following ? <div className='flex gap-1  items-center text-xs text-gray-500' title={t("followings")}><UserCheckIcon className='text-secondary w-4 h-4'/> {r?.author?.following}</div> : null}
                            {r?.author?.friends ? <div className='flex gap-1  items-center text-xs text-gray-500' title={t("frriends")}><UserCheck2 className='text-secondary w-4 h-4'/> {r?.author?.friends}</div> : null}
                          </div>
                        </div>
                    </Link>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Link
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-secondary/90 p-1 rounded hover:bg-blue-50"
                      title={t('viewOriginal')}
                    >
                      <ExternalLink className="h-4 w-4 text-secondary" />
                    </Link>
                    {/* <button
                      className="text-secondary hover:text-secondary/90 p-1 rounded hover:bg-gray-50"
                      title={t('viewDetails')}
                    >
                      <Eye className="h-4 w-4" />
                    </button> */}
                  </div>
                </div>

                <div className={`flex-1 min-w-0 ${locale === 'ar' ? 'mr-14' : 'ml-14'}`}>
                  <p className="text-sm text-gray-700 line-clamp-3 break-words">
                    {r.content.text}
                  </p>

                  <div className="mt-2 flex items-center flex-wrap gap-x-8 gap-y-1 text-xs text-gray-500">
                    <div className='flex items-center gap-x-2'>
                      {getPlatformIcon({ platform: r.platform, className: `w-4 h-4 text-secondary`})}
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        r.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                        r.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {t(r.sentiment)}
                      </span>
                      {r.language && <span className='bg-gray-200 text-secondary px-1 py-[1px] rounded-md'>{t(r.language)}</span>}
                      {r.author.age && <span>{`${t("age")}: ${r.author.age}`}</span>}
                      {r.author.gender && <span>{r.author.gender}</span>}
                    </div>

                    <div className='flex items-center gap-x-2'>
                      {r?.interactions?.reactions !== undefined && 
                        <div className="flex items-center gap-1" title={t("reactions")}>
                          <Heart className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.reactions || 0}</span>
                        </div>
                      }
                      { r.interactions.comments !== undefined && 
                        <div className="flex items-center gap-1" title={t("comments")}>
                          <MessageSquare className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.comments || 0}</span>
                        </div>
                      }
                      { r.interactions.shares !== undefined && 
                        <div className="flex items-center gap-1" title={t("shares")}>
                          <Share2 className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.shares || 0}</span>
                        </div>
                      }
                      { r.interactions.views !== undefined && 
                        <div className="flex items-center gap-1" title={t("views")}>
                          <Eye className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.views || 0}</span>
                        </div>
                      }
                      { r.interactions.bookmarks !== undefined && 
                        <div className="flex items-center gap-1" title={t("bookmarks")}>
                          <Bookmark className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.bookmarks || 0}</span>
                        </div>
                      }
                      { r.interactions.downloads !== undefined && 
                        <div className="flex items-center gap-1" title={t("downloads")}>
                          <DownloadIcon className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.downloads || 0}</span>
                        </div>
                      }
                      { r.interactions.retweets !== undefined && 
                        <div className="flex items-center gap-1" title={t("retweets")}>
                          <Share className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.retweets || 0}</span>
                        </div>
                      }
                      { r.interactions.quotes !== undefined && 
                        <div className="flex items-center gap-1" title={t("quotes")}>
                          <Quote className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.quotes || 0}</span>
                        </div>
                      }
                      { r.interactions.remixes !== undefined && 
                        <div className="flex items-center gap-1" title={t("remixes")}>
                          <RectangleVertical className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.remixes || 0}</span>
                        </div>
                      }
                      { r.interactions.reposts !== undefined && 
                        <div className="flex items-center gap-1" title={t("shares")}>
                          <Share className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.reposts || 0}</span>
                        </div>
                      }
                      { r.interactions.votes !== undefined && 
                        <div className="flex items-center gap-1" title={t("votes")}>
                          <ArrowBigUpIcon className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.votes || 0}</span>
                        </div>
                      }
                      { r.interactions.saves !== undefined && 
                        <div className="flex items-center gap-1" title={t("saves")}>
                          <Save className="h-4 w-4 text-secondary" />
                          <span>{r.interactions.saves || 0}</span>
                        </div>
                      }
                    </div>
                    
                    <div className='flex items-center gap-x-2'>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />{formatDate(r.publishAt)}
                      </span>
                      {r.location?.address && (
                        <span className="flex items-center" title={r.location.address}>
                          <MapPinIcon className="h-3 w-3 mr-1" />
                          {t("hasLocation")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Grid or List view
    const isGrid = viewMode === 'grid';
    const gridColsClass = `grid-cols-${gridColumns}`;
    const listDensityClass = listDensity === 'compact' ? 'p-2' : 'p-4';
    
    return (
      <div className={`${isGrid ? `grid ${gridColsClass} gap-3` : 'space-y-2'} p-4 bg-gray-50 rounded-lg`}>
        {shuffle([...results]).map((r, idx) => (
          <div 
            key={`${groupKey}-${idx}`} 
            className={`${isGrid ? 'flex justify-center relative group' : `flex items-center gap-4 ${listDensityClass} bg-white rounded-lg shadow-sm`} ${
              selectedResults.includes(r.url) ? 'ring-2 ring-secondary' : ''
            }`}
            onMouseEnter={() => isGrid ? onHoverPost(idx) : null}
            onMouseLeave={() => isGrid ? onHoverPost(null) : null}
          >
            {/* Selection checkbox */}
            {selectionMode && (
              <button
                onClick={() => onSelectResult(r.url, !selectedResults.includes(r.url))}
                className={`${isGrid ? 'absolute top-2 left-2 z-10' : 'flex-shrink-0'} flex items-center justify-center w-5 h-5 bg-white rounded shadow-sm`}
              >
                {selectedResults.includes(r.url) ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            )}

            {allowedEmbededPlatforms.includes(r.platform) ? (
              <>
                {isGrid ? (
                  <>
                    {renderEmbdedPlatforms(r)}
                    {/* {hoveredPost === idx && (
                      <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg transition-all duration-300">
                        {renderHoverButtons(idx)}
                      </div>
                    )} */}
                  </>
                ) : (
                  <div className="flex items-center gap-4 w-full">
                    <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      {r.platform}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{r.author.name}</span>
                        <span className="text-sm text-gray-500">@{r.author.handle}</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          r.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          r.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {r.sentiment}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{r.content.text}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span>{r.platform}</span>
                        {r.language && <span>{r.language}</span>}
                        {r.author.age && <span>Age: {r.author.age}</span>}
                        {r.author.gender && <span>{r.author.gender}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title={t('viewOriginal')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                      {r.location?.address && (
                        <div className="text-green-600 p-1 rounded hover:bg-green-50" title={r.location.address}>
                          <MapPinIcon className="h-4 w-4" />
                        </div>
                      )}
                      {/* <button
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                        title={t('viewDetails')}
                      >
                        <Eye className="h-4 w-4" />
                      </button> */}
                    </div>
                  </div>
                )}
              </>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  const renderGroup = (group: GroupNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedGroups.has(group.key);
    const hasChildren = Object.keys(group.children).length > 0;
    const isLeafGroup = !hasChildren;

    return (
      <div key={group.key} className="mb-2" style={{ marginLeft: `${depth * 20}px` }}>
        {renderGroupHeader(group)}

        {isExpanded && (
          <div className="mt-2 space-y-2">
            {/* Render children groups if they exist */}
            {hasChildren ? (
              <div className="space-y-2">
                {Object.values(group.children).map(childGroup =>
                  renderGroup(childGroup, depth + 1)
                )}
              </div>
            ) : (
              /* Render results only at leaf level */
              group.results.length > 0 && (
                <div className="mt-2">
                  {renderResults(group.results, group.key)}
                </div>
              )
            )}
          </div>
        )}
      </div>
    );
  };

  const hierarchicalGroups = buildHierarchicalGroups(results, groupBy);

  if (groupBy.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg shadow-sm p-4">
        {renderResults(results, 'all')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {Object.values(hierarchicalGroups).map(group => renderGroup(group))}
    </div>
  );
} 