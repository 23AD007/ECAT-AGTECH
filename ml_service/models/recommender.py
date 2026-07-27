import numpy as np

class RecommendationEngine:
    """
    Recommendation System for Vendors.
    Recommends crop products to vendors based on past purchase history, crop categories, and popularity.
    """

    def __init__(self):
        # Sample master catalog for recommendations
        self.catalog = [
            {'crop_id': '11111111-1111-1111-1111-111111111111', 'name': 'Wheat', 'category': 'Grains', 'match_score': 0.95},
            {'crop_id': '22222222-2222-2222-2222-222222222222', 'name': 'Corn / Maize', 'category': 'Grains', 'match_score': 0.91},
            {'crop_id': '33333333-3333-3333-3333-333333333333', 'name': 'Organic Tomatoes', 'category': 'Vegetables', 'match_score': 0.88},
            {'crop_id': '44444444-4444-4444-4444-444444444444', 'name': 'Potatoes', 'category': 'Vegetables', 'match_score': 0.82},
            {'crop_id': '55555555-5555-5555-5555-555555555555', 'name': 'Soybeans', 'category': 'Legumes', 'match_score': 0.85}
        ]

    def recommend_for_vendor(self, vendor_id: str, past_purchases: list = None) -> dict:
        """Generate personalized crop recommendations for a vendor."""
        purchased_categories = set()
        if past_purchases:
            for p in past_purchases:
                if 'category' in p:
                    purchased_categories.add(p['category'])

        recommended = []
        for item in self.catalog:
            score = item['match_score']
            # Boost score if vendor previously bought items in this category
            if item['category'] in purchased_categories:
                score = min(0.99, score + 0.08)
                
            recommended.append({
                'crop_id': item['crop_id'],
                'name': item['name'],
                'category': item['category'],
                'recommendation_score': round(float(score), 2),
                'reason': 'Matches your preferred category' if item['category'] in purchased_categories else 'Trending in your region'
            })

        # Sort by recommendation_score descending
        recommended.sort(key=lambda x: x['recommendation_score'], reverse=True)

        return {
            'vendor_id': vendor_id,
            'recommendations': recommended
        }
