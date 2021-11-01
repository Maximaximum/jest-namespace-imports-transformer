import { Injectable } from "@angular/core";
import { gql } from "apollo-angular";
import * as Apollo from "apollo-angular";

import * as Types from "@some/graphql-api";

export type TaskAttachmentCancelUploadMutationVariables = Types.Exact<{
  attachmentId: Types.Scalars["ID"];
}>;

export type TaskAttachmentCancelUploadMutation = {
  __typename?: "Mutation";
} & Pick<Types.Mutation, "taskAttachmentCancelUpload">;

export const TaskAttachmentCancelUploadDocument = gql`
  mutation taskAttachmentCancelUpload($attachmentId: ID!) {
    taskAttachmentCancelUpload(attachmentId: $attachmentId)
  }
`;

@Injectable({
  providedIn: "root",
})
export class TaskAttachmentCancelUploadGQL extends Apollo.Mutation<
  TaskAttachmentCancelUploadMutation,
  TaskAttachmentCancelUploadMutationVariables
> {
  document = TaskAttachmentCancelUploadDocument;

  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
