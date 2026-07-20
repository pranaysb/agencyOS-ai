"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Lead } from "@/lib/types";

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case "High": return "bg-red-500/20 text-red-500 border-red-500/30";
    case "Medium": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    case "Low": return "bg-green-500/20 text-green-500 border-green-500/30";
    default: return "bg-gray-500/20 text-gray-500 border-gray-500/30";
  }
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [urgency, setUrgency] = useState("All");
  const [status, setStatus] = useState("All");

  useEffect(() => {
    async function fetchLeads() {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) {
          setLeads(data);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.sender_name?.toLowerCase().includes(search.toLowerCase()) || 
                          lead.raw_message?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || lead.category === category;
    const matchesUrgency = urgency === "All" || lead.urgency === urgency;
    const matchesStatus = status === "All" || lead.status === status;
    return matchesSearch && matchesCategory && matchesUrgency && matchesStatus;
  });

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-2">Manage and categorize incoming inquiries.</p>
        </div>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Export Leads
        </Button>
      </div>

      <Card className="border-border/60 bg-white/50 backdrop-blur-sm shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search leads..."
                className="pl-8 bg-white/60 border-border/60 focus-visible:ring-primary/30 rounded-lg shadow-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex w-full md:w-auto gap-4 items-center">
              <Filter className="h-4 w-4 text-muted-foreground hidden md:block" />
              <Select value={category} onValueChange={(val) => setCategory(val || "All")}>
                <SelectTrigger className="w-[140px] bg-white/60 border-border/60 shadow-sm rounded-lg">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Brand Deal">Brand Deal</SelectItem>
                  <SelectItem value="Fan Message">Fan Message</SelectItem>
                  <SelectItem value="Spam">Spam</SelectItem>
                </SelectContent>
              </Select>

              <Select value={urgency} onValueChange={(val) => setUrgency(val || "All")}>
                <SelectTrigger className="w-[120px] bg-white/60 border-border/60 shadow-sm rounded-lg">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Urgency</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={(val) => setStatus(val || "All")}>
                <SelectTrigger className="w-[120px] bg-white/60 border-border/60 shadow-sm rounded-lg">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border/50 bg-white/40 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="border-b border-border/50 hover:bg-transparent">
                  <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Sender</TableHead>
                  <TableHead className="w-[40%] font-medium text-muted-foreground uppercase text-xs tracking-wider">Message Preview</TableHead>
                  <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Category</TableHead>
                  <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Urgency</TableHead>
                  <TableHead className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Status</TableHead>
                  <TableHead className="text-right font-medium text-muted-foreground uppercase text-xs tracking-wider">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground animate-pulse border-none">
                      Loading leads...
                    </TableCell>
                  </TableRow>
                ) : filteredLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground border-none">
                      No leads found matching your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="border-b border-border/30 hover:bg-black/[0.02] transition-colors border-none group">
                      <TableCell className="font-medium whitespace-nowrap group-hover:text-primary transition-colors">
                        {lead.sender_name}
                      </TableCell>
                      <TableCell>
                        <p className="truncate max-w-[300px] text-muted-foreground">
                          {lead.raw_message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 rounded-full font-medium">
                          {lead.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${getUrgencyColor(lead.urgency)} rounded-full font-medium`}>
                          {lead.urgency}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium text-muted-foreground capitalize">
                          {lead.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground text-sm whitespace-nowrap font-medium">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
