'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Search, Heart, MessageCircle, Repeat2, Calendar, User, Image as ImageIcon, Eye, ExternalLink, CheckCircle } from 'lucide-react';
import XIcon from '@/components/icons/SocialMedia/X';

interface Tweet {
  id: string;
  username: string;
  displayName: string;
  content: string;
  timestamp: string;
  likes: string;
  retweets: string;
  replies: string;
  media?: string[];
  avatar?: string;
  url?: string;
  viewCount?: string;
  isVerified?: boolean;
}

interface TweetResponse {
  success: boolean;
  data: {
    tweets: Tweet[];
    query: string;
    total: number;
    hasNextPage?: boolean;
    nextCursor?: string;
    source?: string;
  };
}

export default function MonitorPage() {
  const [query, setQuery] = useState('');
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [dataSource, setDataSource] = useState<string>('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api/v1';

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');

    try {
      const response = await axios.get<TweetResponse>(`${API_BASE_URL}/tweet/scrape`, {
        params: { query: searchTerm }
      });

      if (response.data.success) {
        setTweets(response.data.data.tweets);
        setDataSource(response.data.data.source || 'twitter');
        // Add to search history if not already present
        if (!searchHistory.includes(searchTerm)) {
          setSearchHistory(prev => [searchTerm, ...prev.slice(0, 9)]);
        }
      } else {
        setError('Failed to fetch tweets');
      }
    } catch (err) {
      console.error('Error fetching tweets:', err);
      setError('Failed to fetch tweets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const formatNumber = (num: string) => {
    const n = parseInt(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  const formatTimestamp = (timestamp: string) => {
    // Simple timestamp formatting - you might want to use a proper date library
    return timestamp;
  };

  const openTweetUrl = (url: string) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">الرصد المباشر</h1>
          <p className="text-gray-600">البحث والرصد علي تويتر من خلال الكلمات المفتاحية</p>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="أدخل أي كلمات مفتاحية (مطعم البيك)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <XIcon className="w-6 h-6 text-black" />
              )}
              رصد
            </button>
          </form>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">البحث السابق:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(term);
                      handleSearch(term);
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {tweets.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                نتائج الرصد ({tweets.length} تغريدة)
              </h2>
              {/* <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Source: {dataSource === 'nitter' ? 'Nitter' : 'Twitter API'}</span>
                {dataSource === 'nitter' && (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                    Fallback
                  </span>
                )}
              </div> */}
            </div>

            <div className="space-y-4">
              {tweets.map((tweet, index) => (
                <div key={tweet.id || index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {/* Tweet Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {tweet.avatar ? (
                        <img src={tweet.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                      ) : (
                        <User className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {tweet.displayName || tweet.username}
                        </span>
                        {tweet.isVerified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                        <span className="text-gray-500">@{tweet.username}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatTimestamp(tweet.timestamp)}
                        </span>
                      </div>
                    </div>
                    {tweet.url && (
                      <button
                        onClick={() => openTweetUrl(tweet.url!)}
                        className="text-secondary hover:text-secondary"
                        title="Open tweet"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Tweet Content */}
                  <div className="mb-3">
                    <p className="text-gray-900 leading-relaxed">{tweet.content}</p>
                  </div>

                  {/* Tweet Media */}
                  {tweet.media && tweet.media.length > 0 && (
                    <div className="mb-3">
                      <div className="grid grid-cols-2 gap-2">
                        {tweet.media.slice(0, 4).map((media, mediaIndex) => (
                          <div key={mediaIndex} className="relative">
                            <img
                              src={media}
                              alt="Tweet media"
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                              <ImageIcon className="w-3 h-3 inline mr-1" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tweet Engagement */}
                  <div className="flex items-center gap-6 text-primary text-sm">
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{formatNumber(tweet.replies)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Repeat2 className="w-4 h-4" />
                      <span>{formatNumber(tweet.retweets)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      <span>{formatNumber(tweet.likes)}</span>
                    </div>
                    {tweet.viewCount && (
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{formatNumber(tweet.viewCount)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && tweets.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <XIcon className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">لم يتم العثور على تغريدات</h3>
            <p className="text-gray-600">
              أدخل كلمات مفتاحية جديدة لبدء رصد التغريدات
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
