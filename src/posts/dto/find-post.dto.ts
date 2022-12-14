import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dto/output.dto';
import { Post } from '../entity/post.entity';

@InputType()
export class FindPostInput {
  @Field((type) => Number)
  postId: number;
}

@ObjectType()
export class FindPostOutput extends CoreOutput {
  @Field((type) => Post, { nullable: true })
  post?: Post;
}
