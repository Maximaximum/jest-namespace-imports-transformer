import { Injectable } from "@angular/core";
import { gql } from "apollo-angular";
import * as Apollo from "apollo-angular";

export class TaskAttachmentCancelUploadGQL extends Apollo.Mutation<
  string,
  number
> {
  constructor(apollo: Apollo.Apollo) {
    super(apollo);
  }
}
