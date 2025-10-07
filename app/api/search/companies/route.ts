import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Function to check if a company has sufficient data to be considered "fully populated"
function isCompanyFullyPopulated(company: any): boolean {
  const requiredFields = [
    "description",
    "industry",
    "website",
    "country",
    "size",
    "sector",
    "founded_year",
    "headquarters",
    "revenue",
    "employee_count",
    "legal_status",
    "ceo",
    "linkedin",
    "phone",
    "email",
    "business_model",
    "target_market",
  ];

  const optionalButImportantFields = [
    "market_cap",
    "stock_symbol",
    "founders",
    "board_members",
    "twitter",
    "facebook",
    "instagram",
    "youtube",
    "address",
    "glassdoor_rating",
    "google_rating",
    "products",
    "geographic_presence",
    "key_partners",
    "competitors",
    "market_share",
    "competitive_advantage",
    "growth_stage",
  ];

  // Count how many required fields are populated
  const requiredPopulated = requiredFields.filter((field) => {
    const value = company[field];
    return (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0) &&
      !(
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length === 0
      )
    );
  }).length;

  // Count how many optional fields are populated
  const optionalPopulated = optionalButImportantFields.filter((field) => {
    const value = company[field];
    return (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0) &&
      !(
        typeof value === "object" &&
        value !== null &&
        Object.keys(value).length === 0
      )
    );
  }).length;

  // Company is considered fully populated if:
  // - At least 80% of required fields are filled (13 out of 16)
  // - At least 50% of optional fields are filled (10 out of 20)
  const requiredThreshold = Math.ceil(requiredFields.length * 0.8);
  const optionalThreshold = Math.ceil(optionalButImportantFields.length * 0.5);

  return (
    requiredPopulated >= requiredThreshold &&
    optionalPopulated >= optionalThreshold
  );
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type");

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    // Search companies by name (case-insensitive)
    let companiesQuery = supabase
      .from("companies")
      .select(
        `
        *,
        content_items!inner(
          *,
          transcriptions(*),
          business_insights(*)
        ),
        business_insights!inner(*)
      `
      )
      .ilike("name", `%${query}%`)
      .order("name", { ascending: true });

    if (type) {
      companiesQuery = companiesQuery.eq("type", type);
    }

    const { data: companies, error: companiesError } = await companiesQuery;

    if (companiesError) {
      console.error("Error searching companies:", companiesError);
      return NextResponse.json(
        { error: "Failed to search companies" },
        { status: 500 }
      );
    }

    // Filter content items and insights by user
    const filteredCompanies =
      companies?.map((company) => ({
        ...company,
        content_items:
          company.content_items?.filter(
            (item: any) => item.user_id === user.id
          ) || [],
        business_insights:
          company.business_insights?.filter(
            (insight: any) => insight.user_id === user.id
          ) || [],
      })) || [];

    // Also search for content items that might contain the company name
    const { data: relatedContent, error: contentError } = await supabase
      .from("content_items")
      .select(
        `
        *,
        transcriptions(*),
        business_insights(*),
        companies(*)
      `
      )
      .eq("user_id", user.id)
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(10);

    if (contentError) {
      console.error("Error searching content:", contentError);
      return NextResponse.json(
        { error: "Failed to search content" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      companies: filteredCompanies,
      relatedContent: relatedContent || [],
      query,
    });
  } catch (error) {
    console.error("Company search error:", error);
    return NextResponse.json(
      { error: "Failed to search companies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requestBody = await request.json();
    console.log(
      "Company creation request body:",
      JSON.stringify(requestBody, null, 2)
    );

    const {
      name,
      description,
      industry,
      website,
      country,
      size,
      type,
      tradingName,
      sector,
      foundedYear,
      headquarters,
      revenue,
      marketCap,
      employeeCount,
      legalStatus,
      stockSymbol,
      ceo,
      keyExecutives,
      founders,
      boardMembers,
      linkedin,
      twitter,
      facebook,
      instagram,
      youtube,
      otherSocial,
      phone,
      email,
      address,
      supportEmail,
      salesEmail,
      pressContact,
      glassdoorRating,
      googleRating,
      trustpilotScore,
      bbbRating,
      yelpRating,
      industryReviews,
      businessModel,
      products,
      targetMarket,
      geographicPresence,
      languages,
      keyPartners,
      majorClients,
      suppliers,
      competitors,
      acquisitions,
      subsidiaries,
      marketShare,
      competitiveAdvantage,
      industryRanking,
      growthStage,
      marketTrends,
      recentNews,
      pressReleases,
      mediaMentions,
      awards,
      speakingEngagements,
      technologyStack,
      patents,
      rdInvestment,
      innovationAreas,
      techPartnerships,
      esgScore,
      sustainabilityInitiatives,
      corporateValues,
      diversityInclusion,
      socialImpact,
      officeLocations,
      remoteWorkPolicy,
      workCulture,
      benefits,
      hiringStatus,
      swotAnalysis,
      riskFactors,
      growthStrategy,
      investmentThesis,
      dueDiligenceNotes,
    } = requestBody;

    if (!name) {
      console.log("Missing company name in request");
      return NextResponse.json(
        { error: "Company name is required" },
        { status: 400 }
      );
    }

    // Check if company already exists
    const { data: existingCompany, error: checkError } = await supabase
      .from("companies")
      .select("*")
      .eq("name", name)
      .single();

    if (existingCompany) {
      console.log(`Company "${name}" already exists`);

      // Check if the existing company is fully populated
      const isFullyPopulated = isCompanyFullyPopulated(existingCompany);

      if (isFullyPopulated) {
        return NextResponse.json(
          {
            error: `A company named "${name}" already exists with complete information. Please choose a different name or search for the existing company.`,
          },
          { status: 400 }
        );
      } else {
        // Update the existing company with new data
        console.log(`Updating incomplete company "${name}" with new data`);
        const { data: updatedCompany, error: updateError } = await supabase
          .from("companies")
          .update({
            description: description || existingCompany.description,
            industry: industry || existingCompany.industry,
            website: website || existingCompany.website,
            country: country || existingCompany.country,
            size: size || existingCompany.size,
            type: type || existingCompany.type,
            trading_name: tradingName || existingCompany.trading_name,
            sector: sector || existingCompany.sector,
            founded_year: foundedYear || existingCompany.founded_year,
            headquarters: headquarters || existingCompany.headquarters,
            revenue: revenue || existingCompany.revenue,
            market_cap: marketCap || existingCompany.market_cap,
            employee_count: employeeCount || existingCompany.employee_count,
            legal_status: legalStatus || existingCompany.legal_status,
            stock_symbol: stockSymbol || existingCompany.stock_symbol,
            ceo: ceo || existingCompany.ceo,
            key_executives: keyExecutives || existingCompany.key_executives,
            founders: founders || existingCompany.founders,
            board_members: boardMembers || existingCompany.board_members,
            linkedin: linkedin || existingCompany.linkedin,
            twitter: twitter || existingCompany.twitter,
            facebook: facebook || existingCompany.facebook,
            instagram: instagram || existingCompany.instagram,
            youtube: youtube || existingCompany.youtube,
            other_social: otherSocial || existingCompany.other_social,
            phone: phone || existingCompany.phone,
            email: email || existingCompany.email,
            address: address || existingCompany.address,
            support_email: supportEmail || existingCompany.support_email,
            sales_email: salesEmail || existingCompany.sales_email,
            press_contact: pressContact || existingCompany.press_contact,
            glassdoor_rating:
              glassdoorRating || existingCompany.glassdoor_rating,
            google_rating: googleRating || existingCompany.google_rating,
            trustpilot_score:
              trustpilotScore || existingCompany.trustpilot_score,
            bbb_rating: bbbRating || existingCompany.bbb_rating,
            yelp_rating: yelpRating || existingCompany.yelp_rating,
            industry_reviews:
              industryReviews || existingCompany.industry_reviews,
            business_model: businessModel || existingCompany.business_model,
            products: products || existingCompany.products,
            target_market: targetMarket || existingCompany.target_market,
            geographic_presence:
              geographicPresence || existingCompany.geographic_presence,
            languages: languages || existingCompany.languages,
            key_partners: keyPartners || existingCompany.key_partners,
            major_clients: majorClients || existingCompany.major_clients,
            suppliers: suppliers || existingCompany.suppliers,
            competitors: competitors || existingCompany.competitors,
            acquisitions: acquisitions || existingCompany.acquisitions,
            subsidiaries: subsidiaries || existingCompany.subsidiaries,
            market_share: marketShare || existingCompany.market_share,
            competitive_advantage:
              competitiveAdvantage || existingCompany.competitive_advantage,
            industry_ranking:
              industryRanking || existingCompany.industry_ranking,
            growth_stage: growthStage || existingCompany.growth_stage,
            market_trends: marketTrends || existingCompany.market_trends,
            recent_news: recentNews || existingCompany.recent_news,
            press_releases: pressReleases || existingCompany.press_releases,
            media_mentions: mediaMentions || existingCompany.media_mentions,
            awards: awards || existingCompany.awards,
            speaking_engagements:
              speakingEngagements || existingCompany.speaking_engagements,
            technology_stack:
              technologyStack || existingCompany.technology_stack,
            patents: patents || existingCompany.patents,
            rd_investment: rdInvestment || existingCompany.rd_investment,
            innovation_areas:
              innovationAreas || existingCompany.innovation_areas,
            tech_partnerships:
              techPartnerships || existingCompany.tech_partnerships,
            esg_score: esgScore || existingCompany.esg_score,
            sustainability_initiatives:
              sustainabilityInitiatives ||
              existingCompany.sustainability_initiatives,
            corporate_values:
              corporateValues || existingCompany.corporate_values,
            diversity_inclusion:
              diversityInclusion || existingCompany.diversity_inclusion,
            social_impact: socialImpact || existingCompany.social_impact,
            office_locations:
              officeLocations || existingCompany.office_locations,
            remote_work_policy:
              remoteWorkPolicy || existingCompany.remote_work_policy,
            work_culture: workCulture || existingCompany.work_culture,
            benefits: benefits || existingCompany.benefits,
            hiring_status: hiringStatus || existingCompany.hiring_status,
            swot_analysis: swotAnalysis || existingCompany.swot_analysis,
            risk_factors: riskFactors || existingCompany.risk_factors,
            growth_strategy: growthStrategy || existingCompany.growth_strategy,
            investment_thesis:
              investmentThesis || existingCompany.investment_thesis,
            due_diligence_notes:
              dueDiligenceNotes || existingCompany.due_diligence_notes,
          })
          .eq("name", name)
          .select()
          .single();

        if (updateError) {
          console.error("Error updating company:", updateError);
          return NextResponse.json(
            { error: "Database error: " + updateError.message },
            { status: 500 }
          );
        }

        return NextResponse.json(
          {
            message: `Company "${name}" updated successfully with additional information`,
            company: updatedCompany,
          },
          { status: 200 }
        );
      }
    }

    // Create new company
    const { data: company, error: createError } = await supabase
      .from("companies")
      .insert({
        name,
        description,
        industry,
        website,
        country,
        size,
        type: type || "SUPPLIER",
        trading_name: tradingName,
        sector,
        founded_year: foundedYear,
        headquarters,
        revenue,
        market_cap: marketCap,
        employee_count: employeeCount,
        legal_status: legalStatus,
        stock_symbol: stockSymbol,
        ceo,
        key_executives: keyExecutives,
        founders,
        board_members: boardMembers,
        linkedin,
        twitter,
        facebook,
        instagram,
        youtube,
        other_social: otherSocial,
        phone,
        email,
        address,
        support_email: supportEmail,
        sales_email: salesEmail,
        press_contact: pressContact,
        glassdoor_rating: glassdoorRating,
        google_rating: googleRating,
        trustpilot_score: trustpilotScore,
        bbb_rating: bbbRating,
        yelp_rating: yelpRating,
        industry_reviews: industryReviews,
        business_model: businessModel,
        products,
        target_market: targetMarket,
        geographic_presence: geographicPresence,
        languages,
        key_partners: keyPartners,
        major_clients: majorClients,
        suppliers,
        competitors,
        acquisitions,
        subsidiaries,
        market_share: marketShare,
        competitive_advantage: competitiveAdvantage,
        industry_ranking: industryRanking,
        growth_stage: growthStage,
        market_trends: marketTrends,
        recent_news: recentNews,
        press_releases: pressReleases,
        media_mentions: mediaMentions,
        awards,
        speaking_engagements: speakingEngagements,
        technology_stack: technologyStack,
        patents,
        rd_investment: rdInvestment,
        innovation_areas: innovationAreas,
        tech_partnerships: techPartnerships,
        esg_score: esgScore,
        sustainability_initiatives: sustainabilityInitiatives,
        corporate_values: corporateValues,
        diversity_inclusion: diversityInclusion,
        social_impact: socialImpact,
        office_locations: officeLocations,
        remote_work_policy: remoteWorkPolicy,
        work_culture: workCulture,
        benefits,
        hiring_status: hiringStatus,
        swot_analysis: swotAnalysis,
        risk_factors: riskFactors,
        growth_strategy: growthStrategy,
        investment_thesis: investmentThesis,
        due_diligence_notes: dueDiligenceNotes,
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating company:", createError);
      return NextResponse.json(
        { error: "Database error: " + createError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Company created successfully",
        company,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Company creation error:", error);
    return NextResponse.json(
      { error: "Failed to create company" },
      { status: 500 }
    );
  }
}
