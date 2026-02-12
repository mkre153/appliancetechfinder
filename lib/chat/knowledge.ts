/**
 * Consolidated knowledge base for the ATF chatbot.
 * Covers common appliance issues, repair costs, and finding technicians.
 * ~3500 tokens — fits easily in context window.
 */

export const ATF_KNOWLEDGE_BASE = `
## Common Appliance Issues

### Refrigerator
- Not cooling: Check thermostat settings, clean condenser coils, ensure door seals are tight. May need compressor or thermostat replacement ($200-$600).
- Ice maker not working: Check water supply line, replace inlet valve ($80-$200), or replace ice maker assembly ($150-$350).
- Leaking water: Inspect drain pan, defrost drain, and water inlet valve. Usually $100-$300 to fix.
- Making loud noises: Could be evaporator fan motor ($100-$250) or condenser fan ($100-$200).

### Washer
- Won't drain: Check for clogs in drain hose, clean pump filter, replace drain pump ($150-$350).
- Won't spin: Lid switch or door latch issue ($50-$150), worn drive belt ($100-$200), or motor coupler ($100-$250).
- Leaking: Inspect door gasket ($100-$250), hoses, and pump. Front-loaders often develop gasket mold.
- Excessive vibration: Level the machine, check shock absorbers ($100-$200), or replace drum bearings ($150-$400).

### Dryer
- Not heating: Check thermal fuse ($50-$100), heating element ($100-$300), or gas igniter ($80-$200).
- Takes too long to dry: Clean lint trap and vent duct. Blocked vents are a fire hazard — have them professionally cleaned ($100-$170).
- Making noise: Worn drum rollers ($100-$200), broken belt ($80-$200), or bad bearings ($150-$300).

### Dishwasher
- Not cleaning well: Clean spray arms, check water temperature (should be 120F), replace wash motor ($150-$350).
- Not draining: Clean filter, check drain hose for clogs, replace drain pump ($100-$250).
- Leaking: Door gasket ($50-$150), float switch ($80-$150), or inlet valve ($80-$150).

### Oven / Range
- Not heating evenly: Replace bake or broil element ($100-$250), or recalibrate thermostat.
- Gas burner won't ignite: Clean igniter, replace igniter module ($100-$200). NEVER attempt gas repairs yourself.
- Self-clean lock stuck: May need door latch replacement ($100-$200) or control board ($150-$400).

### Microwave
- Not heating: Magnetron failure ($100-$250). Often more cost-effective to replace the unit.
- Turntable not spinning: Replace turntable motor ($50-$100).
- Sparking inside: Remove metal objects, check waveguide cover. NEVER operate a sparking microwave.

### Garbage Disposal
- Jammed: Use hex key in bottom reset hole. If motor is burnt out, replacement is usually $150-$350 installed.
- Leaking: Tighten mounting ring or replace gaskets ($75-$200).

### Freezer
- Not freezing: Check thermostat, condenser coils, evaporator fan. Similar issues and costs to refrigerator repairs.
- Frost buildup: Defrost timer, heater, or thermostat issue ($100-$300).

## Average Repair Costs by Appliance

| Appliance | Average Repair Cost | When to Consider Replacing |
|-----------|-------------------|---------------------------|
| Refrigerator | $200-$500 | Compressor failure on unit 10+ years old |
| Washer | $150-$400 | Motor or transmission failure on unit 8+ years old |
| Dryer | $100-$350 | Motor failure on unit 10+ years old |
| Dishwasher | $150-$350 | Motor or control board on unit 8+ years old |
| Oven/Range | $150-$400 | Control board failure on unit 12+ years old |
| Microwave | $50-$200 | Magnetron failure (often cheaper to replace) |
| Garbage Disposal | $75-$300 | Motor burnout (usually replace entire unit) |
| Freezer | $150-$400 | Compressor failure on unit 10+ years old |
| Ice Maker | $80-$250 | Repeated failures or compressor issues |
| Wine Cooler | $100-$350 | Compressor failure on unit 5+ years old |

## When to Repair vs Replace

### Repair if:
- Appliance is less than halfway through its expected lifespan
- Repair cost is less than 50% of replacement cost
- The issue is a common, straightforward fix (belt, fuse, seal, etc.)
- The appliance is a high-end model worth maintaining

### Replace if:
- Repair cost exceeds 50% of a new unit's price
- Appliance is past its expected lifespan (most last 8-15 years)
- You've had multiple repairs in the past year
- The appliance lacks modern energy efficiency (new units can save $50-$100/year on utilities)
- Major component failure (compressor, motor, control board) on an older unit

### Expected Appliance Lifespans:
- Refrigerator: 10-18 years
- Washer: 8-14 years
- Dryer: 10-14 years
- Dishwasher: 8-12 years
- Oven/Range: 12-16 years
- Microwave: 7-10 years
- Garbage Disposal: 8-12 years

## Finding a Reliable Technician

- Check reviews on Google and Yelp (4+ stars with 20+ reviews is a good sign)
- Verify licensing and insurance — ask for proof before work begins
- Get at least 2-3 estimates for major repairs
- Ask if they specialize in your appliance brand
- Look for factory-authorized service providers for warranty work
- Avoid technicians who diagnose over the phone without seeing the unit
- Ask about the warranty on parts and labor (reputable shops offer 90 days minimum)

Use ApplianceTechFinder.com to browse local repair companies by state and city.

## What to Expect During a Service Call

1. **Scheduling**: Most companies offer same-day or next-day service. Expect a 2-4 hour arrival window.
2. **Diagnostic fee**: Typically $50-$100, often waived if you proceed with the repair.
3. **Diagnosis**: Technician inspects the appliance, identifies the issue, and provides a written estimate.
4. **Approval**: You approve or decline the repair. No work should start without your OK.
5. **Repair**: Common repairs take 30-90 minutes. Parts may need to be ordered (1-5 business days).
6. **Payment**: Most accept credit cards. Get an itemized receipt showing parts and labor.

## Safety Tips

- **Gas appliances**: NEVER attempt to repair gas connections, valves, or igniters yourself. Gas leaks can cause explosions. Always hire a licensed professional.
- **Electrical safety**: Unplug the appliance before any inspection. Never work on a plugged-in unit.
- **Water connections**: Know where your water shutoff valves are before disconnecting supply lines.
- **Refrigerant**: Refrigerator and freezer coolant is regulated — only EPA-certified technicians can handle it.
- **Microwave capacitors**: Can hold lethal voltage even when unplugged. Never open a microwave cabinet yourself.
- **Dryer vents**: Clean lint traps after every load and have the full vent duct cleaned annually. Clogged vents cause 15,000+ house fires per year.
- **When in doubt**: Call a professional. The cost of a service call is far less than the cost of injury or additional damage.
`
