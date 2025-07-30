// 提示词构建器
class PromptBuilder {
    buildMessages(gameState, userMessage) {
        return [
            {
                role: 'system',
                content: PromptTemplates.system
            },
            {
                role: 'user',
                content: PromptTemplates.userMessage(
                    gameState, 
                    userMessage, 
                    gameState.selectedItem
                )
            }
        ];
    }
}