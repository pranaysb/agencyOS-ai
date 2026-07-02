"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Briefcase, Sparkles, Activity } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { Lead, Deal, Creator } from "@/lib/types";

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case "High": return "bg-red-500/20 text-red-500 border-red-500/30";
    case "Medium": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    case "Low": return "bg-green-500/20 text-green-500 border-green-500/30";
    default: return "bg-gray-500/20 text-gray-500 border-gray-500/30";
  }
}

export default function DashboardPage() {
  const [totalLeads, setTotalLeads] = useState<number>(0);
  const [activeDealsCount, setActiveDealsCount] = useState<number>(0);
  const [creatorsMatchedCount, setCreatorsMatchedCount] = useState<number>(0);
  const [pendingActionsCount, setPendingActionsCount] = useState<number>(0);
  
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  const [recentCreators, setRecentCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        // Total Leads count
        const { count: leadsCount } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true });
        setTotalLeads(leadsCount || 0);

        // Active Deals count
        const { count: activeDealsNum } = await supabase
          .from('deals')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');
        setActiveDealsCount(activeDealsNum || 0);

        // Creators Matched count
        const { count: matchedDealsNum } = await supabase
          .from('deals')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'matched');
        setCreatorsMatchedCount(matchedDealsNum || 0);

        // Pending Actions count
        const { count: newLeadsNum } = await supabase
          .from('leads')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');
        setPendingActionsCount(newLeadsNum || 0);

        // Recent Leads (last 5)
        const { data: leadsData } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        if (leadsData) setRecentLeads(leadsData);

        // Active Deals List
        const { data: dealsData } = await supabase
          .from('deals')
          .select('*')
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
        if (dealsData) setActiveDeals(dealsData);

        // Recent Creator Matches
        const { data: creatorsData } = await supabase
          .from('creators')
          .select('*')
          .limit(3);
        if (creatorsData) setRecentCreators(creatorsData);

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground animate-pulse">Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Your agency's performance at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLeads}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDealsCount}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creators Matched</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{creatorsMatchedCount}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Actions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingActionsCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="border-border bg-card lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Sender</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                      No recent leads found.
                    </TableCell>
                  </TableRow>
                ) : (
                  recentLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-border hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{lead.sender_name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                          {lead.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getUrgencyColor(lead.urgency)}>
                          {lead.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground capitalize">{lead.status}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border bg-card lg:col-span-3">
          <CardHeader>
            <CardTitle>Active Deals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {activeDeals.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No active deals right now.</p>
            ) : (
              activeDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{deal.brand_name}</p>
                    <p className="text-sm text-muted-foreground">
                      Score: {deal.deal_score}/10
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium">
                      ${deal.budget?.toLocaleString() || 0}
                    </div>
                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground capitalize">
                      {deal.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Recent Creator Matches</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recentCreators.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">No matched creators yet.</p>
            ) : (
              recentCreators.map((creator) => (
                <div key={creator.id} className="flex items-center gap-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/20 text-primary uppercase">
                      {creator.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {creator.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {creator.engagement_rate}% ER • {creator.followers_count?.toLocaleString() || 0} followers
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    AI Matched
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
