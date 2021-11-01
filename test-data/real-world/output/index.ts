import { Injectable } from "@angular/core";
import { gql } from "apollo-angular";
import {Mutation, Apollo as Apollo_1} from "apollo-angular";

import {Exact, Scalars, Mutation as Mutation_1} from "@some/graphql-api";

export type TaskAttachmentCancelUploadMutationVariables = Exact<{
  attachmentId: Scalars["ID"];
}>;

export type TaskAttachmentCancelUploadMutation = {
  __typename?: "Mutation";
} & Pick<Mutation_1, "taskAttachmentCancelUpload">;

export const TaskAttachmentCancelUploadDocument = gql`
  mutation taskAttachmentCancelUpload($attachmentId: ID!) {
    taskAttachmentCancelUpload(attachmentId: $attachmentId)
  }
`;

@Injectable({
  providedIn: "root",
})
export class TaskAttachmentCancelUploadGQL extends Mutation<
  TaskAttachmentCancelUploadMutation,
  TaskAttachmentCancelUploadMutationVariables
> {
  document = TaskAttachmentCancelUploadDocument;

  constructor(apollo: Apollo_1) {
    super(apollo);
  }
}
