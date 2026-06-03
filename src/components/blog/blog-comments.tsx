"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, User, Send, Clock, ShieldCheck, Mail } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Comment {
  id: number;
  name: string;
  content: string;
  created_at: string;
}

interface BlogCommentsProps {
  postSlug: string;
}

export function BlogComments({ postSlug }: BlogCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  // Fetch comments on mount/slug change
  useEffect(() => {
    async function loadComments() {
      try {
        const res = await fetch(`/api/blog/comment?slug=${postSlug}`);
        if (!res.ok) throw new Error("Failed to load comments.");
        const data = await res.json();
        if (data.success && data.comments) {
          setComments(data.comments);
        }
      } catch (err) {
        console.error("Error loading comments:", err);
      } finally {
        setLoading(false);
      }
    }
    loadComments();
  }, [postSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/blog/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_slug: postSlug,
          name,
          email,
          content
        })
      });

      if (!res.ok) throw new Error("Failed to submit comment.");
      const data = await res.json();
      
      if (data.success && data.comment) {
        toast.success("Comment posted successfully!");
        // Instantly append new comment to comments list for local response
        const newComment: Comment = {
          id: data.comment.id,
          name: data.comment.name,
          content: data.comment.content,
          created_at: data.comment.created_at
        };
        setComments(prev => [...prev, newComment]);
        // Clear fields
        setName("");
        setEmail("");
        setContent("");
      } else {
        throw new Error(data.error || "Submission failed");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 space-y-8 select-none">
      <div className="flex items-center gap-2 border-b pb-4 border-muted/80">
        <MessageSquare className="h-5 w-5 text-primary" />
        <h3 className="font-display font-bold text-xl text-foreground">
          Discussion & Feedback ({comments.length})
        </h3>
      </div>

      {/* Render comments list */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6 text-sm text-muted-foreground animate-pulse">
            Loading comments discussion...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 rounded-xl border border-dashed border-muted bg-card/10 text-sm text-muted-foreground leading-normal">
            No comments yet. Be the first to share your thoughts or ask a question!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const dateStr = new Date(comment.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              });
              return (
                <div
                  key={comment.id}
                  className="rounded-xl border bg-card/30 p-5 space-y-2 border-border/40 shadow-sm relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center font-bold text-[10px] text-primary uppercase">
                        {comment.name.substring(0, 2)}
                      </div>
                      <span className="font-semibold text-xs text-foreground">{comment.name}</span>
                      <Badge variant="outline" className="text-[8px] font-mono py-0 px-1 border-emerald-500/20 text-emerald-400">
                        <ShieldCheck className="h-2 w-2 mr-0.5" /> Verified User
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                      <Clock className="h-3 w-3" /> {dateStr}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed pl-8 pr-4 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Render comment input form */}
      <Card className="p-6 md:p-8 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="max-w-xl space-y-1.5 mb-4">
            <h4 className="font-display font-extrabold text-base text-foreground">Post a Comment / Feedback</h4>
            <p className="text-xs text-muted-foreground">
              Have a question or run into issues? Drop a message! It will be saved and sent directly to the site administrator.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="c-name" className="text-xs font-semibold flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-primary" /> Name
              </Label>
              <Input
                id="c-name"
                placeholder="Enter your name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-primary/20 bg-background/50 focus-visible:ring-primary h-9 text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="c-email" className="text-xs font-semibold flex items-center gap-1">
                <Mail className="h-3.5 w-3.5 text-primary" /> Email
              </Label>
              <Input
                id="c-email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-primary/20 bg-background/50 focus-visible:ring-primary h-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="c-msg" className="text-xs font-semibold">
              Comment / Message
            </Label>
            <textarea
              id="c-msg"
              rows={4}
              placeholder="Type your comment, query, or feedback here..."
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full rounded-md border border-primary/20 bg-background/50 focus-visible:ring-primary text-xs px-3 py-2 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="default"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? "Posting..." : <>Post Comment <Send className="h-3.5 w-3.5 ml-1.5" /></>}
          </Button>
        </form>
      </Card>
    </div>
  );
}
