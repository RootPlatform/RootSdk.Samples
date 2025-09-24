import { SuggestionModel } from "./suggestionRepository";
import { Suggestion, Timestamp } from "@suggestionbox/gen-shared";

export class SuggestionMapper {
  static toDto(suggestionModel: SuggestionModel): Suggestion {
    return {
      id: suggestionModel.id,
      authorId: suggestionModel.author_id,
      text: suggestionModel.text,
      voterIds: suggestionModel.voter_ids,
      createdAt: Timestamp.fromDate(new Date(suggestionModel.created_at)),
    };
  }
}
