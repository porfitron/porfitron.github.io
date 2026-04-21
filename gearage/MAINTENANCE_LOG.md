# Gear Recommendation Engine

## Bike Logic (Standard Intervals)
- **Chain:** Every 2,000 miles (Check for stretch).
- **Tires:** Every 2,500 miles (Inspect tread wear/sealant).
- **Cables/Hydraulics:** Every 5,000 miles (Full service).
- **Bottom Bracket:** Every 3,000 miles (Check for creaks/play).

## Shoe Logic
- **Rotation Warning:** 250 miles ("Great time to start a new pair").
- **Health Warning:** 400 miles ("Midsole may be losing responsiveness").
- **Replacement Alert:** 500 miles ("Recommended retirement mileage reached").

## Dynamic Copy Generation
The app should use the `brand_name` to make tips feel personal:
- *Input:* `Specialized` + `2,000 miles`.
- *Output:* "Your Specialized is due for a drivetrain deep-clean."