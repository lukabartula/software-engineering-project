import RecipeCardNormal from './RecipeCardNormal';
import RecipeCardFeatured from './RecipeCardFeatured';

export function RecipeCardFactory(type, props) {
  switch(type) {
    case 'featured':
      return <RecipeCardFeatured {...props} />;
    default:
      return <RecipeCardNormal {...props} />;
  }
}
