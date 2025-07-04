import React, { useState, useRef, useEffect } from "react";
import { Book, Play, Clock, Pause } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export interface BookItem {
  id: string;
  title: string;
  author: string;
  duration: string;
  category: string;
  status: "to-listen" | "listening" | "completed";
  coverUrl?: string;
  description: string;
  audio?: string;
}

interface BookCardProps {
  book: BookItem;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (value: number[]) => {
    const newTime = value[0];
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      return () => {
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      };
    }
  }, []);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "listening":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "listening":
        return "Currently Listening";
      default:
        return "To Listen";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-purple-50 border-purple-100">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-purple-700 transition-colors">
              {book.title}
            </CardTitle>
            <CardDescription className="text-purple-600 font-medium mt-1">
              {book.author}
            </CardDescription>
          </div>
          <div className="ml-3 flex-shrink-0">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="w-12 h-16 object-cover rounded-md shadow-sm"
              />
            ) : (
              <div className="w-12 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-md flex items-center justify-center">
                <Book className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {book.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{book.duration}</span>
          </div>
          <Badge variant="secondary" className="text-xs">
            {book.category}
          </Badge>
        </div>

        <div className="flex items-center justify-between mb-2">
          <Badge
            className={`text-xs ${getStatusColor(book.status)} text-white`}
          >
            {getStatusText(book.status)}
          </Badge>
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <audio
              ref={audioRef}
              src={`/audio/${book.audio}`}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
            />
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-gray-500 w-8">
            {formatTime(currentTime)}
          </span>
          <Slider
            className="flex-1"
            value={[currentTime]}
            max={duration}
            step={1}
            onValueChange={handleSliderChange}
          />
          <span className="text-xs text-gray-500 w-8">
            {formatTime(duration)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
