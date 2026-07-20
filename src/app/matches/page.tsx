"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, TrendingUp, AlertTriangle, ShieldCheck, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Deal, Creator } from "@/lib/types";

// Mock helper to generate match insights for a creator and a deal
function getMatchInsights(creatorName: string, dealName: string) {
  const isHighFit = Math.random() > 0.3;
  return {
    whyGoodFit: isHighFit 
      ? `Strong overlap with ${dealName}'s target audience demographics.` 
      : `Decent engagement, but niche alignment is broad.`,
    estimatedReach: Math.floor(Math.random() * 50 + 10) + "k - " + Math.floor(Math.random() * 100 + 100) + "k views",
    riskLevel: isHighFit ? "Low" : "Medium",
  };
}

export default function MatchesPage() {
  const [activeDeals, setActiveDeals] = useState<Deal[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const [dealsRes, creatorsRes] = await Promise.all([
          supabase.from('deals').select('*').in('status', ['pending', 'matched']),
          supabase.from('creators').select('*').limit(3)
        ]);
        
        if (dealsRes.data) setActiveDeals(dealsRes.data);
        if (creatorsRes.data) setCreators(creatorsRes.data);
      } catch (error) {
        console.error("Error fetching matches data:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground animate-pulse">Loading AI matches...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Creator Matches</h1>
        <p className="text-muted-foreground mt-2">AI-driven creator recommendations for your active deals.</p>
      </div>

      {activeDeals.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-xl bg-card">
          <p className="text-muted-foreground">No active deals found to match.</p>
        </div>
      ) : (
        <div className="space-y-12">
          {activeDeals.map(deal => (
            <div key={deal.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-border gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{deal.brand_name} Campaign</h2>
                  <p className="text-sm text-muted-foreground">Budget: ${deal.budget?.toLocaleString() || 0} • {deal.category}</p>
                </div>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 w-fit">
                  Top 3 Matches
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {creators.map((creator, idx) => {
                  const insights = getMatchInsights(creator.name, deal.brand_name);
                  return (
                    <Card key={creator.id} className="border-border/60 bg-white/50 backdrop-blur-sm shadow-sm flex flex-col hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 rounded-2xl group">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-primary/20 group-hover:border-primary/50 transition-colors shadow-sm">
                              <AvatarFallback className="bg-primary/10 text-primary font-serif font-bold uppercase">
                                {creator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-base font-serif group-hover:text-primary transition-colors">{creator.name}</CardTitle>
                              <p className="text-sm text-muted-foreground font-medium">{creator.instagram_handle}</p>
                            </div>
                          </div>
                          {idx === 0 && (
                            <Badge className="bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 border-none shadow-sm hover:opacity-90 whitespace-nowrap rounded-full font-semibold">
                              Best Match
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="flex-1 space-y-5">
                        <div className="grid grid-cols-2 gap-4 bg-white/60 p-4 rounded-xl border border-border/50 shadow-inner">
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1 mb-1">
                              <Users className="h-3 w-3" /> Followers
                            </p>
                            <p className="font-bold text-foreground text-lg">{creator.followers_count?.toLocaleString() || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider flex items-center gap-1 mb-1">
                              <TrendingUp className="h-3 w-3" /> Engagement
                            </p>
                            <p className="font-bold text-primary text-lg">{creator.engagement_rate}%</p>
                          </div>
                        </div>

                        <div className="space-y-3 px-1">
                          <div>
                            <p className="text-sm font-semibold text-foreground mb-1.5 flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              Why they fit
                            </p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {deal.creator_requirements ? `Matches requirement: "${deal.creator_requirements}". ${insights.whyGoodFit}` : insights.whyGoodFit}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm pt-2">
                            <span className="text-muted-foreground font-medium">Estimated Reach:</span>
                            <span className="font-semibold text-foreground">{insights.estimatedReach}</span>
                          </div>
                          
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground font-medium">Risk Level:</span>
                            <div className="flex items-center gap-1">
                              {insights.riskLevel === "Low" ? (
                                <ShieldCheck className="h-4 w-4 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              )}
                              <span className={`font-semibold ${insights.riskLevel === "Low" ? "text-green-500" : "text-yellow-600"}`}>
                                {insights.riskLevel}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="pt-4 border-t border-border/40 mt-auto flex-col gap-3">
                        <Badge variant="outline" className="w-full justify-center bg-primary/5 text-primary border-primary/20 rounded-full font-medium py-1">
                          ✨ AI Matched
                        </Badge>
                        <div className="w-full flex gap-2">
                          <button className="w-1/2 rounded-xl border border-border/60 bg-white/50 text-sm font-semibold py-2.5 hover:bg-black/5 hover:text-foreground transition-all shadow-sm">
                            View Profile
                          </button>
                          <button className="w-1/2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold py-2.5 hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
                            Approve Match
                          </button>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
