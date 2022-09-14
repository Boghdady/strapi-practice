"use strict";

/**
 * post controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::post.post", ({ strapi }) => ({
  // Replacing a core action
  // async find(ctx) {
  //   const isRequestNonPremium =
  //     ctx.query.filters && ctx.query.filters.premium == false;

  //   if (ctx.state.user || isRequestNonPremium) return await super.find(ctx);

  //   // some custom logic here
  //   const filteredPosts = await strapi.service("api::post.post").find({
  //     ...ctx.query,
  //     filters: {
  //       ...ctx.query.filters,
  //       premium: false,
  //     },
  //   });

  //   const sanitizedEntity = await this.sanitizeOutput(filteredPosts, ctx);
  //   return this.transformResponse(sanitizedEntity);
  // },

  async find(ctx) {
    // If user authenticated or request public posts
    const isRequestNonPremium =
      ctx.query.filters && ctx.query.filters.premium == false;
    if (ctx.state.user || isRequestNonPremium) return await super.find(ctx);

    // If user not authenticated
    const publicPosts = await strapi
      .service("api::post.post")
      .findPublicPosts(ctx.query);

    const sanitizedEntity = await this.sanitizeOutput(publicPosts, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  async findOne(ctx) {
    const { id } = ctx.params;
    const { query } = ctx;

    // If authenticated user, return the post
    if (ctx.state.user) return await super.findOne(ctx);

    // If user request for a public post return it, if not return 404 error
    const postIfPublic = await strapi
      .service("api::post.post")
      .findIfPublicPost({ id, query });

    const sanitizedEntity = await this.sanitizeOutput(postIfPublic, ctx);
    return this.transformResponse(sanitizedEntity);
  },

  async likePost(ctx) {
    const user = ctx.state.user;
    const postId = ctx.params.id;
    const { query } = ctx;

    const updatedPost = await strapi.service("api::post.post").likePost({
      postId,
      userId: user.id,
      query,
    });

    const sanitizedEntity = await this.sanitizeOutput(updatedPost, ctx);
    return this.transformResponse(sanitizedEntity);
  },
}));
