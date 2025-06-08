class VideoManager {
    constructor() {
        this.videos = new Map();
        this.quizzes = new Map();
        this.usersVideos = new Map();
    }

    addVideo(file, name, description, metadata = {}) {
        if (!AuthManager.isAuthenticated()) {
            throw new Error("User is not authenticated.");
        }
        
        this.videos.set(name, { 
            file, 
            description,
            duration: metadata.duration || 0,
            uploadDate: new Date(),
            watchedCount: 0,
            totalWatchTime: 0,
            ...metadata
        });
    }

    removeVideo(name) {
        if (!AuthManager.isAuthenticated()) {
            throw new Error("User is not authenticated.");
        }
        
        this.videos.delete(name);
        this.quizzes.delete(name);
        
        // Remove from all users' progress
        this.usersVideos.forEach(userVideos => {
            userVideos.delete(name);
        });
    }

    trackVideoProgress(userId, videoName, watchedTime) {
        const video = this.videos.get(videoName);
        if (!video) return false;

        if (!this.usersVideos.has(userId)) {
            this.usersVideos.set(userId, new Map());
        }

        const userVideos = this.usersVideos.get(userId);
        let progress = userVideos.get(videoName) || {
            lastWatched: new Date(),
            totalWatched: 0,
            completed: false
        };

        progress.totalWatched += watchedTime;
        progress.lastWatched = new Date();
        
        // Mark as completed if watched 90% or more
        if (!progress.completed && (progress.totalWatched / video.duration) >= 0.9) {
            progress.completed = true;
            video.watchedCount++;
        }

        video.totalWatchTime += watchedTime;
        userVideos.set(videoName, progress);
        return true;
    }

    getVideoAnalytics(videoName) {
        const video = this.videos.get(videoName);
        if (!video) return null;

        return {
            views: video.watchedCount,
            totalWatchTime: video.totalWatchTime,
            avgWatchTime: video.watchedCount > 0 
                ? video.totalWatchTime / video.watchedCount 
                : 0
        };
    }
}