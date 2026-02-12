const NH = {
  "Bondi Beach":1.5,"Surry Hills":1.35,"Newtown":1.2,"Paddington":1.3,
  "Chippendale":1.1,"Darlinghurst":1.25,"Redfern":1.05,"Marrickville":1,
  "Glebe":1.1,"Manly":1.3,"Barangaroo":1.45,"Pyrmont":1.15,"Other":.9
}

export function calcPrice(wall) {
  const sq = parseFloat(wall.width_m) * parseFloat(wall.height_m) || 20
  const base = 55
  const tM = { Low:.6, Medium:1, High:1.5, "Very High":2 }[wall.traffic_level] || 1
  const nM = NH[wall.neighborhood] || .9
  const cM = { Poor:.7, Fair:.85, Good:1, Excellent:1.15 }[wall.condition] || 1
  const oM = (wall.orientation||"").includes("North") ? 1.1 : (wall.orientation||"").includes("East") ? 1.05 : 1
  const dur = parseInt(wall.duration_months) || 6
  const dD = dur >= 24 ? .85 : dur >= 12 ? .9 : dur >= 6 ? .95 : 1
  const aM = wall.access_level === "Ground level (no equipment)" ? 1
    : wall.access_level === "Requires ladder/scaffolding" ? .95
    : wall.access_level === "Requires cherry picker/boom lift" ? .88 : .82
  const mo = sq * base * tM * nM * cM * oM * dD * aM
  return {
    total: Math.round(mo * dur / 100) * 100,
    monthly: Math.round(mo / 10) * 10,
    sqm: Math.round(sq * 10) / 10
  }
}

export const NEIGHBORHOODS = Object.keys(NH)
export const TRAFFIC_LEVELS = ["Low","Medium","High","Very High"]
export const CONDITIONS = ["Poor","Fair","Good","Excellent"]
export const ORIENTATIONS = ["North","South","East","West","North-East","North-West","South-East","South-West"]
export const DURATIONS = ["3","6","12","24"]
export const ACCESS_OPTS = ["Ground level (no equipment)","Requires ladder/scaffolding","Requires cherry picker/boom lift","Requires building/rooftop access"]
export const BUILDING_TYPES = ["Commercial","Residential","Industrial","Retail","Hospitality","Mixed Use","Temporary Wall / Hoarding","Government / Public","Other"]
export const COORDS = {"Bondi Beach":{lat:-33.891,lng:151.274},"Surry Hills":{lat:-33.884,lng:151.211},"Newtown":{lat:-33.897,lng:151.179},"Paddington":{lat:-33.884,lng:151.226},"Chippendale":{lat:-33.888,lng:151.199},"Darlinghurst":{lat:-33.878,lng:151.218},"Redfern":{lat:-33.893,lng:151.204},"Marrickville":{lat:-33.910,lng:151.155},"Glebe":{lat:-33.879,lng:151.186},"Manly":{lat:-33.797,lng:151.287},"Barangaroo":{lat:-33.861,lng:151.202},"Pyrmont":{lat:-33.870,lng:151.194},"Other":{lat:-33.868,lng:151.209}}
export const fmt = p => new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",maximumFractionDigits:0}).format(p)
