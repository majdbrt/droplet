
export const sortGroups = (groups) => {
    const sortedGroups = groups.sort((a, b) => {
        const timeA = a.updatedAt;
        const timeB = b.updatedAt;

        if (timeA > timeB) {
            return -1;
        }
        if (timeA < timeB) {
            return 1;
        }
        return 0;
    });

    return sortedGroups;
}

export const sortMessages = (messages) => {
    const sortedMessages = messages.sort((a, b) => {
        const timeA = a.createdAt;
        const timeB = b.createdAt;

        if (timeA > timeB) {
            return 1;
        }
        if (timeA < timeB) {
            return -1;
        }
        return 0
    });
    return sortedMessages;
}