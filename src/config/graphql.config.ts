export default () => ({
  graphql: {
    installSubscriptionHandlers: true, // 启用订阅
    typePaths: ['./**/*.graphql'], // 指示 GraphQLModule 应该查找 GraphQL 文件的位置
  },
});
