import {useState, 
    useMemo, 
    useEffect, 
    // useCallback
} from 'react';

import { Topic } from '../../types/Forum.tsx';


// -----Import Hooks-----
import useFetchTopic from '../api/topic/useFetchTopic.tsx';
import useCreateTopic from '../api/topic/useCreateTopic.tsx';
import usePinTopic from '../api/topic/usePinTopic.tsx';

export const useForumManager = () => {

    const [localTopics, setLocalTopics] = useState<Topic[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [createDialogOpen, setCreateDialogOpen] = useState<boolean>(false);

    // -----Forum states and actions----
    const {topics: serverTopics, fetchTopics} = useFetchTopic();
    const {topicCreate} = useCreateTopic();
    const {topicPin} = usePinTopic();

    useEffect(() => {
        fetchTopics();
    }, []);

    useEffect(() => {
        if (serverTopics) setLocalTopics(serverTopics);
    }, [serverTopics]);

    // -----Search Action-----
    const filteredTopics = useMemo(() => {
        const term = searchTerm.toLowerCase();

        return localTopics.filter(t => 
            t.Title.toLowerCase().includes(term) ||
            t.Description.toLowerCase().includes(term)
        );
    }, [localTopics, searchTerm]);

    const pinnedTopics = useMemo(() => filteredTopics.filter(t => t.Pinned), [filteredTopics]);
    const otherTopics = useMemo(() => filteredTopics.filter(t => !t.Pinned), [filteredTopics]);

    // -----CRUD Action-----
    const handleCreate = async(title: string, description: string) => {
        await topicCreate(title, description);
        
        const newTopic: Topic = {
            ID: Date.now(),
            Title: title,
            Description: description,
            Pinned: false,
            Created: true,
        };

        // Push new topic to the top
        setLocalTopics(prev => [newTopic, ...prev]);

        setCreateDialogOpen(false);
    };

    const handleUpdate = (id: number, newTitle: string, newDescription: string) => {
        setLocalTopics(prev => prev.map(t => 
            t.ID === id
                ? {...t, Title: newTitle, Description: newDescription}
                : t
        ));
    };

    const handleDelete = (id: number) => {
        setLocalTopics(prev => prev.filter(t => t.ID !== id));
    };

    const handlePin = async(id: number) => {
        const topic = localTopics.find(t => t.ID === id);
        if (!topic) return;

        await topicPin(topic.Title); // need to change to ID instead

        setLocalTopics(prev => prev.map(t => 
            t.ID === id 
                ? {...t, Pinned: !t.Pinned}
                : t
        ));
    };

    return {
        searchTerm,
        setSearchTerm,

        localTopics,
        setLocalTopics,

        pinnedTopics,
        otherTopics,

        createDialogOpen,
        setCreateDialogOpen,

        handleCreate,
        handleUpdate,
        handleDelete,
        handlePin
    }
}

// export default useForumManager;