"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, ClockIcon, TagIcon, EyeIcon, ThumbsUpIcon, MessageSquareIcon, SearchIcon } from 'lucide-react'

// Enhanced mock data
const mockPosts = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    content: 'Artificial Intelligence is revolutionizing the way we build and interact with websites. From chatbots to personalized user experiences, AI is becoming an integral part of modern web development. This post explores the current state of AI in web development and looks ahead to future trends that will shape the industry.',
    isPublished: true,
    createdAt: '2024-07-10T10:00:00Z',
    publishedAt: '2024-07-10T12:00:00Z',
    author: 'Jane Doe',
    tags: ['AI', 'Web Development', 'Technology'],
    views: 1520,
    likes: 89,
    comments: 23,
    versions: [
      {
        postVersion: 1,
        title: 'AI in Web Dev - Draft',
        content: 'Initial draft discussing AI in web development.',
        isPublished: false,
        createdAt: '2024-07-10T09:00:00Z',
      },
      {
        postVersion: 2,
        title: 'The Future of AI in Web Development',
        content: 'Artificial Intelligence is revolutionizing the way we build and interact with websites. From chatbots to personalized user experiences, AI is becoming an integral part of modern web development. This post explores the current state of AI in web development and looks ahead to future trends that will shape the industry.',
        isPublished: true,
        publishedAt: '2024-07-10T12:00:00Z',
        createdAt: '2024-07-10T10:00:00Z',
      },
    ],
  },
  {
    id: '2',
    title: 'Mastering CSS Grid Layout',
    content: "CSS Grid Layout has transformed the way we design web layouts. This comprehensive guide walks you through the fundamentals of CSS Grid, from basic concepts to advanced techniques. Learn how to create responsive, flexible layouts that adapt to any screen size. We'll cover grid containers, grid items, template areas, and more. By the end of this post, you'll have the skills to create complex layouts with ease.",
    isPublished: true,
    createdAt: '2024-07-11T14:30:00Z',
    publishedAt: '2024-07-11T16:45:00Z',
    author: 'John Smith',
    tags: ['CSS', 'Web Design', 'Frontend'],
    views: 2103,
    likes: 156,
    comments: 45,
    versions: [
      {
        postVersion: 1,
        title: 'CSS Grid Basics',
        content: 'Initial draft covering CSS Grid fundamentals.',
        isPublished: false,
        createdAt: '2024-07-11T13:00:00Z',
      },
      {
        postVersion: 2,
        title: 'Mastering CSS Grid Layout',
        content: "CSS Grid Layout has transformed the way we design web layouts. This comprehensive guide walks you through the fundamentals of CSS Grid, from basic concepts to advanced techniques. Learn how to create responsive, flexible layouts that adapt to any screen size. We'll cover grid containers, grid items, template areas, and more. By the end of this post, you'll have the skills to create complex layouts with ease.",
        isPublished: true,
        publishedAt: '2024-07-11T16:45:00Z',
        createdAt: '2024-07-11T14:30:00Z',
      },
    ],
  },
  {
    id: '3',
    title: 'Optimizing React Performance',
    content: "As React applications grow in complexity, performance optimization becomes crucial. This post delves into various techniques to boost your React app's performance. We'll explore topics such as memo, useMemo, and useCallback hooks, code splitting, lazy loading, and the importance of key prop in lists. Learn how to identify performance bottlenecks and implement solutions that will make your React apps lightning fast.",
    isPublished: false,
    createdAt: '2024-07-12T09:15:00Z',
    author: 'Alice Johnson',
    tags: ['React', 'JavaScript', 'Performance'],
    views: 0,
    likes: 0,
    comments: 0,
    versions: [
      {
        postVersion: 1,
        title: 'Optimizing React Performance',
        content: "As React applications grow in complexity, performance optimization becomes crucial. This post delves into various techniques to boost your React app's performance. We'll explore topics such as memo, useMemo, and useCallback hooks, code splitting, lazy loading, and the importance of key prop in lists. Learn how to identify performance bottlenecks and implement solutions that will make your React apps lightning fast.",
        isPublished: false,
        createdAt: '2024-07-12T09:15:00Z',
      },
    ],
  },
];


export default async function CMSPostsPage() {
  const [posts, setPosts] = useState(mockPosts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPublished, setFilterPublished] = useState('all');

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterPublished === 'all' || 
     (filterPublished === 'published' && post.isPublished) ||
     (filterPublished === 'draft' && !post.isPublished))
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">CMS Posts</h1>
      <div className="mb-6 flex space-x-4">
        <div className="flex-grow">
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={filterPublished} onValueChange={setFilterPublished}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <SearchIcon className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

const PostCard = ({ post }: { post: typeof mockPosts[number] }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [isExpanded, setIsExpanded] = useState(false);

  const truncatedContent = post.content.slice(0, 150) + (post.content.length > 150 ? '...' : '');

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{post.title}</span>
          <Badge variant={post.isPublished ? "default" : "secondary"}>
            {post.isPublished ? "Published" : "Draft"}
          </Badge>
        </CardTitle>
        <CardDescription>
          <div className="flex items-center space-x-2 mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span>Created: {new Date(post.createdAt).toLocaleString()}</span>
            {post.publishedAt && (
              <>
                <ClockIcon className="w-4 h-4 ml-2" />
                <span>Published: {new Date(post.publishedAt).toLocaleString()}</span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span>By: {post.author}</span>
            <TagIcon className="w-4 h-4 ml-2" />
            {post.tags.map((tag, index) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="current">Current Version</TabsTrigger>
            <TabsTrigger value="history">Version History</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <p>{isExpanded ? post.content : truncatedContent}</p>
            {post.content.length > 150 && (
              <Button variant="link" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Show Less' : 'Read More'}
              </Button>
            )}
            <div className="flex items-center space-x-4 mt-4">
              <span className="flex items-center"><EyeIcon className="w-4 h-4 mr-1" /> {post.views}</span>
              <span className="flex items-center"><ThumbsUpIcon className="w-4 h-4 mr-1" /> {post.likes}</span>
              <span className="flex items-center"><MessageSquareIcon className="w-4 h-4 mr-1" /> {post.comments}</span>
            </div>
          </TabsContent>
          <TabsContent value="history">
            <ScrollArea className="h-[200px]">
              {post.versions.map((version) => (
                <div key={version.postVersion} className="mb-4 p-4 border rounded">
                  <h4 className="font-bold">Version {version.postVersion}</h4>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(version.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-2">{version.content.slice(0, 100)}...</p>
                  <Badge variant={version.isPublished ? "default" : "secondary"} className="mt-2">
                    {version.isPublished ? "Published" : "Draft"}
                  </Badge>
                </div>
              ))}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant={post.isPublished ? "secondary" : "default"}>
          {post.isPublished ? "Unpublish" : "Publish"}
        </Button>
        <Button variant="outline">Edit</Button>
      </CardFooter>
    </Card>
  );
};