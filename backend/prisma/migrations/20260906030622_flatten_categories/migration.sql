-- Flatten the two-level category/emotion taxonomy into a single flat
-- category list. Existing rows are backfilled: "feeling" held either the
-- canonical emotion key or, for pre-key records, the raw French label —
-- both are matched below to the new categoryId. Rows whose "feeling" text
-- doesn't match any known category (a handful of legacy/renamed entries)
-- keep their original text in categoryName with categoryId left NULL.

ALTER TABLE "MoodState" ADD COLUMN "categoryId" INTEGER;
ALTER TABLE "MoodState" ADD COLUMN "categoryName" TEXT;
ALTER TABLE "SharedState" ADD COLUMN "categoryId" INTEGER;
ALTER TABLE "SharedState" ADD COLUMN "categoryName" TEXT;

UPDATE "MoodState" SET
  "categoryId" = CASE "feeling"
    WHEN 'want_to_know_you' THEN 1
    WHEN 'Envie de te connaître plus' THEN 1
    WHEN 'interested_in_you' THEN 2
    WHEN 'Tu m''intéresses' THEN 2
    WHEN 'want_to_understand_you' THEN 3
    WHEN 'Envie de mieux te comprendre' THEN 3
    WHEN 'want_to_discover_you' THEN 4
    WHEN 'Envie de découvrir qui tu es' THEN 4
    WHEN 'feel_connected' THEN 5
    WHEN 'Je me sens connecté à toi' THEN 5
    WHEN 'feel_close_to_you' THEN 6
    WHEN 'Je me sens proche de toi' THEN 6
    WHEN 'want_to_spend_time_together' THEN 7
    WHEN 'Envie de passer du temps avec toi' THEN 7
    WHEN 'want_to_see_you_again' THEN 8
    WHEN 'Envie de te revoir' THEN 8
    WHEN 'want_to_be_friends' THEN 9
    WHEN 'J''aimerais être ton ami' THEN 9
    WHEN 'want_to_keep_in_touch' THEN 10
    WHEN 'Envie de garder contact' THEN 10
    WHEN 'like_you' THEN 11
    WHEN 'Tu me plais' THEN 11
    WHEN 'feel_affection' THEN 12
    WHEN 'J''ai de l''affection pour toi' THEN 12
    WHEN 'miss_you' THEN 13
    WHEN 'Tu me manques' THEN 13
    WHEN 'think_about_you' THEN 14
    WHEN 'Je pense à toi' THEN 14
    WHEN 'feel_attracted' THEN 15
    WHEN 'Je suis attiré par toi' THEN 15
    WHEN 'developing_feelings' THEN 16
    WHEN 'Des sentiments commencent à apparaître' THEN 16
    WHEN 'need_space' THEN 17
    WHEN 'Besoin d''espace' THEN 17
    WHEN 'want_to_take_distance' THEN 18
    WHEN 'Envie de prendre de la distance' THEN 18
    WHEN 'want_to_slow_down' THEN 19
    WHEN 'Envie de ralentir' THEN 19
    WHEN 'not_ready' THEN 20
    WHEN 'Je ne suis pas prêt' THEN 20
    WHEN 'uncertain' THEN 21
    WHEN 'Je ne sais pas ce que je ressens' THEN 21
    WHEN 'want_to_end_connection' THEN 22
    WHEN 'Envie de mettre fin à la relation' THEN 22
    ELSE NULL
  END,
  "categoryName" = CASE "feeling"
    WHEN 'want_to_know_you' THEN 'Envie de te connaître plus'
    WHEN 'Envie de te connaître plus' THEN 'Envie de te connaître plus'
    WHEN 'interested_in_you' THEN 'Tu m''intéresses'
    WHEN 'Tu m''intéresses' THEN 'Tu m''intéresses'
    WHEN 'want_to_understand_you' THEN 'Envie de mieux te comprendre'
    WHEN 'Envie de mieux te comprendre' THEN 'Envie de mieux te comprendre'
    WHEN 'want_to_discover_you' THEN 'Envie de découvrir qui tu es'
    WHEN 'Envie de découvrir qui tu es' THEN 'Envie de découvrir qui tu es'
    WHEN 'feel_connected' THEN 'Je me sens connecté à toi'
    WHEN 'Je me sens connecté à toi' THEN 'Je me sens connecté à toi'
    WHEN 'feel_close_to_you' THEN 'Je me sens proche de toi'
    WHEN 'Je me sens proche de toi' THEN 'Je me sens proche de toi'
    WHEN 'want_to_spend_time_together' THEN 'Envie de passer du temps avec toi'
    WHEN 'Envie de passer du temps avec toi' THEN 'Envie de passer du temps avec toi'
    WHEN 'want_to_see_you_again' THEN 'Envie de te revoir'
    WHEN 'Envie de te revoir' THEN 'Envie de te revoir'
    WHEN 'want_to_be_friends' THEN 'J''aimerais être ton ami'
    WHEN 'J''aimerais être ton ami' THEN 'J''aimerais être ton ami'
    WHEN 'want_to_keep_in_touch' THEN 'Envie de garder contact'
    WHEN 'Envie de garder contact' THEN 'Envie de garder contact'
    WHEN 'like_you' THEN 'Tu me plais'
    WHEN 'Tu me plais' THEN 'Tu me plais'
    WHEN 'feel_affection' THEN 'J''ai de l''affection pour toi'
    WHEN 'J''ai de l''affection pour toi' THEN 'J''ai de l''affection pour toi'
    WHEN 'miss_you' THEN 'Tu me manques'
    WHEN 'Tu me manques' THEN 'Tu me manques'
    WHEN 'think_about_you' THEN 'Je pense à toi'
    WHEN 'Je pense à toi' THEN 'Je pense à toi'
    WHEN 'feel_attracted' THEN 'Je suis attiré par toi'
    WHEN 'Je suis attiré par toi' THEN 'Je suis attiré par toi'
    WHEN 'developing_feelings' THEN 'Des sentiments commencent à apparaître'
    WHEN 'Des sentiments commencent à apparaître' THEN 'Des sentiments commencent à apparaître'
    WHEN 'need_space' THEN 'Besoin d''espace'
    WHEN 'Besoin d''espace' THEN 'Besoin d''espace'
    WHEN 'want_to_take_distance' THEN 'Envie de prendre de la distance'
    WHEN 'Envie de prendre de la distance' THEN 'Envie de prendre de la distance'
    WHEN 'want_to_slow_down' THEN 'Envie de ralentir'
    WHEN 'Envie de ralentir' THEN 'Envie de ralentir'
    WHEN 'not_ready' THEN 'Je ne suis pas prêt'
    WHEN 'Je ne suis pas prêt' THEN 'Je ne suis pas prêt'
    WHEN 'uncertain' THEN 'Je ne sais pas ce que je ressens'
    WHEN 'Je ne sais pas ce que je ressens' THEN 'Je ne sais pas ce que je ressens'
    WHEN 'want_to_end_connection' THEN 'Envie de mettre fin à la relation'
    WHEN 'Envie de mettre fin à la relation' THEN 'Envie de mettre fin à la relation'
    ELSE "feeling"
  END;

UPDATE "SharedState" SET
  "categoryId" = CASE "feeling"
    WHEN 'want_to_know_you' THEN 1
    WHEN 'Envie de te connaître plus' THEN 1
    WHEN 'interested_in_you' THEN 2
    WHEN 'Tu m''intéresses' THEN 2
    WHEN 'want_to_understand_you' THEN 3
    WHEN 'Envie de mieux te comprendre' THEN 3
    WHEN 'want_to_discover_you' THEN 4
    WHEN 'Envie de découvrir qui tu es' THEN 4
    WHEN 'feel_connected' THEN 5
    WHEN 'Je me sens connecté à toi' THEN 5
    WHEN 'feel_close_to_you' THEN 6
    WHEN 'Je me sens proche de toi' THEN 6
    WHEN 'want_to_spend_time_together' THEN 7
    WHEN 'Envie de passer du temps avec toi' THEN 7
    WHEN 'want_to_see_you_again' THEN 8
    WHEN 'Envie de te revoir' THEN 8
    WHEN 'want_to_be_friends' THEN 9
    WHEN 'J''aimerais être ton ami' THEN 9
    WHEN 'want_to_keep_in_touch' THEN 10
    WHEN 'Envie de garder contact' THEN 10
    WHEN 'like_you' THEN 11
    WHEN 'Tu me plais' THEN 11
    WHEN 'feel_affection' THEN 12
    WHEN 'J''ai de l''affection pour toi' THEN 12
    WHEN 'miss_you' THEN 13
    WHEN 'Tu me manques' THEN 13
    WHEN 'think_about_you' THEN 14
    WHEN 'Je pense à toi' THEN 14
    WHEN 'feel_attracted' THEN 15
    WHEN 'Je suis attiré par toi' THEN 15
    WHEN 'developing_feelings' THEN 16
    WHEN 'Des sentiments commencent à apparaître' THEN 16
    WHEN 'need_space' THEN 17
    WHEN 'Besoin d''espace' THEN 17
    WHEN 'want_to_take_distance' THEN 18
    WHEN 'Envie de prendre de la distance' THEN 18
    WHEN 'want_to_slow_down' THEN 19
    WHEN 'Envie de ralentir' THEN 19
    WHEN 'not_ready' THEN 20
    WHEN 'Je ne suis pas prêt' THEN 20
    WHEN 'uncertain' THEN 21
    WHEN 'Je ne sais pas ce que je ressens' THEN 21
    WHEN 'want_to_end_connection' THEN 22
    WHEN 'Envie de mettre fin à la relation' THEN 22
    ELSE NULL
  END,
  "categoryName" = CASE "feeling"
    WHEN 'want_to_know_you' THEN 'Envie de te connaître plus'
    WHEN 'Envie de te connaître plus' THEN 'Envie de te connaître plus'
    WHEN 'interested_in_you' THEN 'Tu m''intéresses'
    WHEN 'Tu m''intéresses' THEN 'Tu m''intéresses'
    WHEN 'want_to_understand_you' THEN 'Envie de mieux te comprendre'
    WHEN 'Envie de mieux te comprendre' THEN 'Envie de mieux te comprendre'
    WHEN 'want_to_discover_you' THEN 'Envie de découvrir qui tu es'
    WHEN 'Envie de découvrir qui tu es' THEN 'Envie de découvrir qui tu es'
    WHEN 'feel_connected' THEN 'Je me sens connecté à toi'
    WHEN 'Je me sens connecté à toi' THEN 'Je me sens connecté à toi'
    WHEN 'feel_close_to_you' THEN 'Je me sens proche de toi'
    WHEN 'Je me sens proche de toi' THEN 'Je me sens proche de toi'
    WHEN 'want_to_spend_time_together' THEN 'Envie de passer du temps avec toi'
    WHEN 'Envie de passer du temps avec toi' THEN 'Envie de passer du temps avec toi'
    WHEN 'want_to_see_you_again' THEN 'Envie de te revoir'
    WHEN 'Envie de te revoir' THEN 'Envie de te revoir'
    WHEN 'want_to_be_friends' THEN 'J''aimerais être ton ami'
    WHEN 'J''aimerais être ton ami' THEN 'J''aimerais être ton ami'
    WHEN 'want_to_keep_in_touch' THEN 'Envie de garder contact'
    WHEN 'Envie de garder contact' THEN 'Envie de garder contact'
    WHEN 'like_you' THEN 'Tu me plais'
    WHEN 'Tu me plais' THEN 'Tu me plais'
    WHEN 'feel_affection' THEN 'J''ai de l''affection pour toi'
    WHEN 'J''ai de l''affection pour toi' THEN 'J''ai de l''affection pour toi'
    WHEN 'miss_you' THEN 'Tu me manques'
    WHEN 'Tu me manques' THEN 'Tu me manques'
    WHEN 'think_about_you' THEN 'Je pense à toi'
    WHEN 'Je pense à toi' THEN 'Je pense à toi'
    WHEN 'feel_attracted' THEN 'Je suis attiré par toi'
    WHEN 'Je suis attiré par toi' THEN 'Je suis attiré par toi'
    WHEN 'developing_feelings' THEN 'Des sentiments commencent à apparaître'
    WHEN 'Des sentiments commencent à apparaître' THEN 'Des sentiments commencent à apparaître'
    WHEN 'need_space' THEN 'Besoin d''espace'
    WHEN 'Besoin d''espace' THEN 'Besoin d''espace'
    WHEN 'want_to_take_distance' THEN 'Envie de prendre de la distance'
    WHEN 'Envie de prendre de la distance' THEN 'Envie de prendre de la distance'
    WHEN 'want_to_slow_down' THEN 'Envie de ralentir'
    WHEN 'Envie de ralentir' THEN 'Envie de ralentir'
    WHEN 'not_ready' THEN 'Je ne suis pas prêt'
    WHEN 'Je ne suis pas prêt' THEN 'Je ne suis pas prêt'
    WHEN 'uncertain' THEN 'Je ne sais pas ce que je ressens'
    WHEN 'Je ne sais pas ce que je ressens' THEN 'Je ne sais pas ce que je ressens'
    WHEN 'want_to_end_connection' THEN 'Envie de mettre fin à la relation'
    WHEN 'Envie de mettre fin à la relation' THEN 'Envie de mettre fin à la relation'
    ELSE "feeling"
  END;

ALTER TABLE "MoodState" ALTER COLUMN "categoryName" SET NOT NULL;
ALTER TABLE "SharedState" ALTER COLUMN "categoryName" SET NOT NULL;

ALTER TABLE "MoodState" DROP COLUMN "stepId";
ALTER TABLE "MoodState" DROP COLUMN "stepName";
ALTER TABLE "MoodState" DROP COLUMN "feeling";
ALTER TABLE "SharedState" DROP COLUMN "stepId";
ALTER TABLE "SharedState" DROP COLUMN "stepName";
ALTER TABLE "SharedState" DROP COLUMN "feeling";

