import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  CheckPasswordInput,
  CheckPasswordOutput,
} from './dto/check-password.dto';
import {
  CreateCommentInput,
  CreateCommentOutput,
} from './dto/create-comment.dto';
import { CreatePostInput, CreatePostOutut } from './dto/create-post.dto';
import {
  DeleteCommentInput,
  DeleteCommentOutput,
} from './dto/delete-comment.dto';
import { DeletePostInput, DeletePostOutput } from './dto/delete-post.dto';
import { EditCommentInput, EditCommentOutput } from './dto/edit-comment.dto';
import {
  FindAllCommentsInput,
  FindAllCommentsOutput,
} from './dto/find-all-comments.dto';
import {
  FindAllPostsInput,
  FindAllPostsOutput,
} from './dto/find-all-posts.dto';
import { FindPostInput, FindPostOutput } from './dto/find-post.dto';
import { UpdatePostOutput, UpdatePostInput } from './dto/update-post.dto';
import { Post } from './entity/post.entity';
import { PostService } from './posts.service';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}
  @Mutation(() => CreatePostOutut)
  async createPost(
    @AuthUser() authUser: User,
    @Args('input') CreatePostInput: CreatePostInput,
  ): Promise<CreatePostOutut> {
    return await this.postService.createPost(authUser, CreatePostInput);
  }
  @Query(() => FindAllPostsOutput)
  async findAllPosts(
    @Args('input') FindAllPostsInput: FindAllPostsInput,
  ): Promise<FindAllPostsOutput> {
    return await this.postService.findAllPosts(FindAllPostsInput);
  }

  @Query(() => CheckPasswordOutput)
  async checkPassword(
    @AuthUser() authUser: User,
    @Args('input') CheckPasswordInput: CheckPasswordInput,
  ): Promise<CheckPasswordOutput> {
    return await this.postService.checkPassword(authUser, CheckPasswordInput);
  }

  @Query(() => FindPostOutput)
  async findPost(
    @AuthUser() authUser: User,
    @Args(`input`) FindPostInput: FindPostInput,
  ): Promise<FindPostOutput> {
    return await this.postService.findPost(authUser, FindPostInput);
  }
  @Mutation(() => UpdatePostOutput)
  // @Role(['Client']) login will be updated later
  async updatePost(
    @AuthUser() authUser: User,
    @Args('input') UpdatePostInput: UpdatePostInput,
  ): Promise<UpdatePostOutput> {
    return await this.postService.updatePost(authUser, UpdatePostInput);
  }

  @Mutation(() => DeletePostOutput)
  // @Role(['Client']) login will be updated later
  async deletePost(
    @AuthUser() authUser: User,
    @Args('input') DeletePostInput: DeletePostInput,
  ): Promise<DeletePostOutput> {
    return await this.postService.deletePost(authUser, DeletePostInput);
  }

  @Mutation(() => CreateCommentOutput)
  async createComment(
    @AuthUser() authUser: User,
    @Args('input') CreateCommentInput: CreateCommentInput,
  ): Promise<CreateCommentOutput> {
    return await this.postService.createComment(authUser, CreateCommentInput);
  }

  @Query(() => FindAllCommentsOutput)
  async findAllComments(
    @Args('input') FindAllCommentsInput: FindAllCommentsInput,
  ): Promise<FindAllCommentsOutput> {
    return await this.postService.findAllComments(FindAllCommentsInput);
  }

  @Mutation(() => DeleteCommentOutput)
  // @Role(['Client']) login will be updated later
  async deleteComment(
    @AuthUser() authUser: User,
    @Args('input') DeleteCommentInput: DeleteCommentInput,
  ): Promise<DeleteCommentOutput> {
    return await this.postService.deleteComment(authUser, DeleteCommentInput);
  }
  
  @Mutation(() => EditCommentOutput)
  @Role(['Manager'])
  async editComment(
    @AuthUser() authUser: User,
    @Args('input') EditCommentInput: EditCommentInput,
  ): Promise<EditCommentOutput> {
    return await this.postService.editComment(authUser, EditCommentInput);
  }
}
