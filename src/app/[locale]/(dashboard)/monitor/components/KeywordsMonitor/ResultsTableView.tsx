'use client';

import React, { useState } from 'react';
import { IMonitorResult, MonitorSentimentsEnum, PlatformsNamesEnum } from './types';
import { 
  ExternalLink, 
  MapPin, 
  User, 
  Calendar, 
  MessageSquare,
  Heart,
  Share2,
  Eye,
  Square,
  CheckSquare,
  VerifiedIcon,
  Users,
  UserCheck2,
  UserCheckIcon,
  Bell,
  Bookmark,
  DownloadIcon,
  Share,
  Quote,
  RectangleVertical,
  ArrowBigUpIcon,
  Save
} from 'lucide-react';
import { getPlatformIcon, getProfileLink } from './utils';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

interface ResultsTableViewProps {
  results: IMonitorResult[];
  currentPage: number;
  itemsPerPage: number;
  locale: string;
  selectedResults?: Set<string>;
  onSelectResult?: (resultId: string, selected: boolean) => void;
  onSelectAllInPage?: (results: IMonitorResult[], selected: boolean) => void;
  selectionMode?: boolean;
  groupBy?: string[];
  onSelectAllInGroup?: (results: IMonitorResult[], selected: boolean) => void;
}

export default function ResultsTableView({
  results,
  currentPage,
  itemsPerPage,
  locale,
  selectedResults = new Set(),
  onSelectResult,
  onSelectAllInPage,
  selectionMode = false,
  groupBy = [],
  onSelectAllInGroup
}: ResultsTableViewProps) {

  const t = useTranslations("Monitor.keywords.results")

  const [errorImages, setErrorImages] = useState<string[]>([])
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedResults = results.slice(startIndex, endIndex);

  // Selection helpers
  const allSelectedInPage = paginatedResults.length > 0 && 
    paginatedResults.every(result => selectedResults.has(result.url));
  const someSelectedInPage = paginatedResults.some(result => selectedResults.has(result.url));

  const handleSelectAllInPage = () => {
    if (onSelectAllInPage) {
      onSelectAllInPage(paginatedResults, !allSelectedInPage);
    }
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
    return date.toLocaleDateString(locale == 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getGroupKey = (result: IMonitorResult, groupType: string) => {
    switch (groupType) {
      case 'platform':
        return result.platform;
      case 'language':
        return result.language || 'unknown';
      case 'sentiment':
        return result.sentiment;
      case 'gender':
        return result.author.gender || 'unknown';
      case 'age': {
        const age = result.author.age;
        if (age == null) return 'unknown';
        if (age < 18) return 'Under 18';
        if (age < 25) return '18-24';
        if (age < 35) return '25-34';
        if (age < 45) return '35-44';
        return '45+';
      }
      case 'location':
        return result.location?.address ? 'Has Location' : 'No Location';
      case 'author':
        return result.author.name || result.author.handle;
      default:
        return 'Group';
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

  const groupType = groupBy[0];
  const groupedMap: Record<string, IMonitorResult[]> | null = groupType
    ? paginatedResults.reduce((acc, r) => {
        const key = getGroupKey(r, groupType);
        if (!acc[key]) acc[key] = [];
        acc[key].push(r);
        return acc;
      }, {} as Record<string, IMonitorResult[]>)
    : null;


  const renderTableRow = (results: IMonitorResult[], key: string) => {
    return results.map((result, index) => (
        <tr 
          key={`${key}-${index}`}
          className={`text-xs hover:bg-primary/10 transition-colors ${
            selectedResults.has(result.url) ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
        >
          {selectionMode && onSelectResult && (
            <td className="px-2 py-2 whitespace-nowrap">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={selectedResults.has(result.url)}
                  onChange={(e) => onSelectResult(result.url, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                />
              </div>
            </td>
          )}
          <td className="px-2 py-2 whitespace-nowrap">
            <div className="flex items-center">
              <Link href={result.url} target='_blank'>{getPlatformIcon({ platform: result.platform, className: `w-6 h-6 text-secondary` })}</Link>
              {/* <span className="text-sm font-medium text-gray-900 capitalize">
                {result.platform}
              </span> */}
            </div>
          </td>
          <td className="px-2 py-2 whitespace-nowrap">
            <Link 
              href={getProfileLink({ platform: result.platform, handle: result.author.handle }) || ""}
              target="_blank"
              className="flex gap-1 items-center"
            >
              <div className="flex-shrink-0 h-12 w-12">
                <div
                  className="h-full w-full rounded-full bg-gray-300 flex items-center justify-center">
                  {/* <User className="h-4 w-4 text-gray-600" /> */}
                  {!result.author.avatar || errorImages.includes(result.url) ?
                    getPlatformIcon({ platform: result.platform, className: `w-6 h-6 text-secondary` })
                    : 
                    <img 
                      src={result.author.avatar} 
                      alt={result.author.name[0]} 
                      className={`w-full h-full rounded-full` }
                      onError={() => {
                        setErrorImages([... errorImages, result.url])
                      }}
                    />
                  }
                  
                </div>
              </div>
              <div className="">
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                  <span className='hover:underline'>{result.author.name}</span>
                  {result.author.isVerified && <VerifiedIcon className='h-4 w-4 text-white fill-primary' />}
                </div>
                <div className="text-xs text-gray-500 hover:underline">
                  @{result.author.handle}
                </div>
                <div className="flex gap-2 items-center text-xs text-gray-500 mt-1">
                  {result?.author?.followers ? <div className='flex gap-1  items-center text-xs text-gray-500' title={t("followers")}><Users className='text-secondary w-4 h-4' /> {result?.author?.followers}</div> : null}
                  {result?.author?.subscribers ? <div className='flex gap-1  items-center text-xs text-gray-500' title={t("subscribers")}><Bell className='text-secondary w-4 h-4'/> {result?.author?.subscribers}</div> : null}
                  {result?.author?.following ? <div className='flex gap-1  items-center text-xs text-gray-500' title={t("followings")}><UserCheckIcon className='text-secondary w-4 h-4'/> {result?.author?.following}</div> : null}
                  {result?.author?.friends ? <div className='flex gap-1  items-center text-xs text-gray-500' title={t("frriends")}><UserCheck2 className='text-secondary w-4 h-4'/> {result?.author?.friends}</div> : null}
                </div>
              </div>
            </Link>
          </td>
          <td className="px-2 py-2">
            <div className="max-w-xs">
              <p className="text-sm text-gray-900 line-clamp-3">
                {result.content.text}
              </p>
              {result.content.images.length > 0 && (
                <div className="mt-1 text-[10px] text-gray-500">
                  📷 {result.content.images.length} {t('images')}
                </div>
              )}
              {result.content.videos.length > 0 && (
                <div className="mt-1 text-xs text-gray-500">
                  🎥 {result.content.videos.length} {t('videos')}
                </div>
              )}
            </div>
          </td>
          <td className="px-2 py-2 whitespace-nowrap">
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSentimentColor(result.sentiment)}`}>
              {t(result.sentiment)}
            </span>
          </td>
          <td className="px-2 py-2 whitespace-nowrap text-xs text-gray-900">
            {result?.language ? t(result.language) :  '-'}
          </td>
          <td className="px-2 py-2 whitespace-nowrap">
            <div className="flex flex-col gap-1 items-start text-xs text-gray-500">
              {result?.interactions?.reactions !== undefined && 
                <div className="flex items-center gap-1" title={t("reactions")}>
                  <Heart className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.reactions || 0}</span>
                </div>
              }
              { result.interactions.comments !== undefined && 
                <div className="flex items-center gap-1" title={t("comments")}>
                  <MessageSquare className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.comments || 0}</span>
                </div>
              }
              { result.interactions.shares !== undefined && 
                <div className="flex items-center gap-1" title={t("shares")}>
                  <Share2 className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.shares || 0}</span>
                </div>
              }
              { result.interactions.views !== undefined && 
                <div className="flex items-center gap-1" title={t("views")}>
                  <Eye className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.views || 0}</span>
                </div>
              }
              { result.interactions.bookmarks !== undefined && 
                <div className="flex items-center gap-1" title={t("bookmarks")}>
                  <Bookmark className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.bookmarks || 0}</span>
                </div>
              }
              { result.interactions.downloads !== undefined && 
                <div className="flex items-center gap-1" title={t("downloads")}>
                  <DownloadIcon className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.downloads || 0}</span>
                </div>
              }
              { result.interactions.retweets !== undefined && 
                <div className="flex items-center gap-1" title={t("retweets")}>
                  <Share className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.retweets || 0}</span>
                </div>
              }
              { result.interactions.quotes !== undefined && 
                <div className="flex items-center gap-1" title={t("quotes")}>
                  <Quote className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.quotes || 0}</span>
                </div>
              }
              { result.interactions.remixes !== undefined && 
                <div className="flex items-center gap-1" title={t("remixes")}>
                  <RectangleVertical className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.remixes || 0}</span>
                </div>
              }
              { result.interactions.reposts !== undefined && 
                <div className="flex items-center gap-1" title={t("shares")}>
                  <Share className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.reposts || 0}</span>
                </div>
              }
              { result.interactions.votes !== undefined && 
                <div className="flex items-center gap-1" title={t("votes")}>
                  <ArrowBigUpIcon className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.votes || 0}</span>
                </div>
              }
              { result.interactions.saves !== undefined && 
                <div className="flex items-center gap-1" title={t("saves")}>
                  <Save className="h-4 w-4 text-secondary" />
                  <span>{result.interactions.saves || 0}</span>
                </div>
              }
            </div>
          </td>
          <td className="px-2 py-2 whitespace-nowrap text-gray-500">
            <div className="flex items-center text-xs">
              {/* <Calendar className="h-4 w-4 mr-1" /> */}
              {formatDate(result.publishAt)}
            </div>
          </td>
          <td className="px-2 py-2 whitespace-nowrap text-sm font-medium">
            <div className="flex items-center justify-end space-x-2 ">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover:text-secondary/90 p-1 rounded hover:bg-blue-50"
                title={t('viewOriginal')}
              >
                <ExternalLink className="h-4 w-4 text-secondary" />
              </a>
              {result.location?.address && (
                <div className="text-primary p-1 rounded hover:bg-green-50" title={result.location.address}>
                  <MapPin className="h-4 w-4 text-secondary" />
                </div>
              )}
              <button
                className="text-primary hover:text-primary/90 p-1 rounded hover:bg-gray-50"
                title={t('viewDetails')}
              >
                <Eye className="h-4 w-4 text-secondary" />
              </button>
            </div>
          </td>
        </tr>
    )) 
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-primary/10 text-primary">
            <tr>
              {selectionMode && onSelectResult && (
                <th className="px-4 py-3 text-start text-xs font-semibold text-primary uppercase tracking-wider">
                  <button
                    onClick={handleSelectAllInPage}
                    className="flex items-center justify-center w-5 h-5"
                  >
                    {allSelectedInPage ? (
                      <CheckSquare className="w-5 h-5 text-blue-600" />
                    ) : someSelectedInPage ? (
                      <Square className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </th>
              )}
              <th className="px-4 py-3 text-start text-xs font-semibold text-primary uppercase tracking-wider">
                {t('platform')}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-primary uppercase tracking-wider">
                {t('author')}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-primary uppercase tracking-wider">
                {t('content')}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-primary uppercase tracking-wider">
                {t('sentiment')}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-primary uppercase tracking-wider">
                {t('language')}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-primary uppercase tracking-wider">
                {t('interactions')}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-primary uppercase tracking-wider">
                {t('date')}
              </th>
              <th className="px-4 py-3 text-start text-xs font-semibold text-primary uppercase tracking-wider">
                {t('actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groupedMap
              ? Object.entries(groupedMap).map(([key, group]) => {
                  const selectedInGroup = group.filter(r => selectedResults.has(r.url)).length;
                  const isAllSelected = selectedInGroup === group.length && group.length > 0;
                  const isPartiallySelected = selectedInGroup > 0 && selectedInGroup < group.length;
                  return (
                    <React.Fragment key={key}>
                      <tr className="bg-gray-100">
                        <td colSpan={9} className="px-4 py-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {selectionMode && onSelectAllInGroup && (
                                <button
                                  onClick={() => onSelectAllInGroup(group, !isAllSelected)}
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
                              <span className="text-sm font-semibold text-gray-800">
                                {getGroupLabel(groupType, key)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {selectedInGroup > 0 ? `${selectedInGroup}/${group.length}` : group.length} {t('results')}
                              </span>
                            </div>
                          </div>
                        </td>
                      </tr>
                      { renderTableRow(group, key)}
                    </React.Fragment>
                  );
                })
              : renderTableRow(paginatedResults, "")
              }
          </tbody>
        </table>
      </div>

      {paginatedResults.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">
            {t('noResults')}
          </div>
        </div>
      )}
    </div>
  );
} 