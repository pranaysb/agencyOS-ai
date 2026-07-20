"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Target, ListTodo } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Deal } from "@/lib/types";

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case "High": return "bg-red-500/20 text-red-500 border-red-500/30";
    case "Medium": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
    case "Low": return "bg-green-500/20 text-green-500 border-green-500/30";
    default: return "bg-gray-500/20 text-gray-500 border-gray-500/30";
  }
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { id: "pending", title: "Pending Deals" },
    { id: "matched", title: "Matched Creators" },
    { id: "closed", title: "Closed Won" },
  ];

  useEffect(() => {
    async function fetchDeals() {
      setIsLoading(true);
      try {
        const { data } = await supabase
          .from('deals')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (data) {
          setDeals(data);
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDeals();
  }, []);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Deals Pipeline</h1>
        <p className="text-muted-foreground mt-2">Track and manage active campaign opportunities.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnDeals = deals.filter((d) => d.status === column.id);
          return (
            <div key={column.id} className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{column.title}</h2>
                <Badge variant="secondary" className="bg-secondary/50 rounded-full font-medium">
                  {columnDeals.length}
                </Badge>
              </div>

              <div className="flex flex-col gap-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground animate-pulse text-sm">
                    Loading deals...
                  </div>
                ) : columnDeals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm border border-dashed border-border/60 rounded-xl bg-white/30 backdrop-blur-sm">
                    No deals in this stage
                  </div>
                ) : (
                  columnDeals.map((deal) => (
                    <Card key={deal.id} className="border-border/60 bg-white/50 backdrop-blur-sm shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-xl group">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-serif group-hover:text-primary transition-colors">{deal.brand_name}</CardTitle>
                          <Badge variant="outline" className={`${getUrgencyColor(deal.urgency)} rounded-full font-medium`}>
                            {deal.urgency}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 font-medium">
                          <Badge variant="secondary" className="text-xs bg-primary/5 text-primary rounded-full hover:bg-primary/10 transition-colors">
                            Score: {deal.deal_score}
                          </Badge>
                          <span>•</span>
                          <span>{deal.category}</span>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4 text-sm pb-4">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          ${deal.budget?.toLocaleString() || 0}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                          <Calendar className="h-4 w-4" />
                          {deal.campaign_dates}
                        </div>
                        
                        <Separator className="bg-border/50" />
                        
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <Target className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                            <p className="text-muted-foreground line-clamp-2 leading-relaxed">{deal.creator_requirements}</p>
                          </div>
                          {deal.deliverables && (Array.isArray(deal.deliverables) || typeof deal.deliverables === 'string') && (
                            <div className="flex items-start gap-2">
                              <ListTodo className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                              <div className="flex flex-wrap gap-1">
                                {(Array.isArray(deal.deliverables) 
                                  ? deal.deliverables 
                                  : (deal.deliverables.startsWith('[') 
                                      ? JSON.parse(deal.deliverables) 
                                      : deal.deliverables.split(','))
                                ).map((item: string, i: number) => (
                                  <Badge key={i} variant="outline" className="text-[10px] py-0 border-border/60 rounded-full font-medium">
                                    {typeof item === 'string' ? item.trim() : item}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="pt-0 pb-4">
                        <Link href="/matches" className="inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-medium transition-all outline-none select-none h-9 px-4 w-full bg-primary/5 text-primary hover:bg-primary hover:text-primary-foreground">
                          View Matches
                        </Link>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
