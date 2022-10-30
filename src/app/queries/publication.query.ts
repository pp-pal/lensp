import { gql } from 'apollo-angular';

export const singlePublication = gql`
    query Publication ($publicationId: InternalPublicationId!) {
        publication(request: {
            publicationId: $publicationId
        }) {
        __typename 
            ... on Post {
            ...PostFields
            }
            ... on Comment {
            ...CommentFields
            }
            ... on Mirror {
            ...MirrorFields
            }
        }
        }

        fragment MediaFields on Media {
        url
        mimeType
        }

        fragment ProfileFields on Profile {
        id
        name
        bio
        attributes {
            displayType
            traitType
            key
            value
        }
        isFollowedByMe
        isFollowing(who: null)
        followNftAddress
        metadata
        isDefault
        handle
        picture {
            ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
            }
            ... on MediaSet {
            original {
                ...MediaFields
            }
            }
        }
        coverPicture {
            ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
            }
            ... on MediaSet {
            original {
                ...MediaFields
            }
            }
        }
        ownedBy
        dispatcher {
            address
        }
        stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
        }
        followModule {
            ...FollowModuleFields
        }
        }

        fragment PublicationStatsFields on PublicationStats { 
        totalAmountOfMirrors
        totalAmountOfCollects
        totalAmountOfComments
        }

        fragment MetadataOutputFields on MetadataOutput {
        name
        description
        content
        media {
            original {
            ...MediaFields
            }
        }
        attributes {
            displayType
            traitType
            value
        }
        }

        fragment Erc20Fields on Erc20 {
        name
        symbol
        decimals
        address
        }

        fragment PostFields on Post {
        id
        profile {
            ...ProfileFields
        }
        stats {
            ...PublicationStatsFields
        }
        metadata {
            ...MetadataOutputFields
        }
        createdAt
        collectModule {
            ...CollectModuleFields
        }
        referenceModule {
            ...ReferenceModuleFields
        }
        appId
        hidden
        reaction(request: null)
        mirrors(by: null)
        hasCollectedByMe
        }

        fragment MirrorBaseFields on Mirror {
        id
        profile {
            ...ProfileFields
        }
        stats {
            ...PublicationStatsFields
        }
        metadata {
            ...MetadataOutputFields
        }
        createdAt
        collectModule {
            ...CollectModuleFields
        }
        referenceModule {
            ...ReferenceModuleFields
        }
        appId
        hidden
        reaction(request: null)
        hasCollectedByMe
        }

        fragment MirrorFields on Mirror {
        ...MirrorBaseFields
        mirrorOf {
        ... on Post {
            ...PostFields          
        }
        ... on Comment {
            ...CommentFields          
        }
        }
        }

        fragment CommentBaseFields on Comment {
        id
        profile {
            ...ProfileFields
        }
        stats {
            ...PublicationStatsFields
        }
        metadata {
            ...MetadataOutputFields
        }
        createdAt
        collectModule {
            ...CollectModuleFields
        }
        referenceModule {
            ...ReferenceModuleFields
        }
        appId
        hidden
        reaction(request: null)
        mirrors(by: null)
        hasCollectedByMe
        }

        fragment CommentFields on Comment {
        ...CommentBaseFields
        mainPost {
            ... on Post {
            ...PostFields
            }
            ... on Mirror {
            ...MirrorBaseFields
            mirrorOf {
                ... on Post {
                ...PostFields          
                }
                ... on Comment {
                ...CommentMirrorOfFields        
                }
            }
            }
        }
        }

        fragment CommentMirrorOfFields on Comment {
        ...CommentBaseFields
        mainPost {
            ... on Post {
            ...PostFields
            }
            ... on Mirror {
            ...MirrorBaseFields
            }
        }
        }

        fragment FollowModuleFields on FollowModule {
        ... on FeeFollowModuleSettings {
            type
            amount {
            asset {
                name
                symbol
                decimals
                address
            }
            value
            }
            recipient
        }
        ... on ProfileFollowModuleSettings {
            type
            contractAddress
        }
        ... on RevertFollowModuleSettings {
            type
            contractAddress
        }
        ... on UnknownFollowModuleSettings {
            type
            contractAddress
            followModuleReturnData
        }
        }

        fragment CollectModuleFields on CollectModule {
        __typename
        ... on FreeCollectModuleSettings {
            type
            followerOnly
            contractAddress
        }
        ... on FeeCollectModuleSettings {
            type
            amount {
            asset {
                ...Erc20Fields
            }
            value
            }
            recipient
            referralFee
        }
        ... on LimitedFeeCollectModuleSettings {
            type
            collectLimit
            amount {
            asset {
                ...Erc20Fields
            }
            value
            }
            recipient
            referralFee
        }
        ... on LimitedTimedFeeCollectModuleSettings {
            type
            collectLimit
            amount {
            asset {
                ...Erc20Fields
            }
            value
            }
            recipient
            referralFee
            endTimestamp
        }
        ... on RevertCollectModuleSettings {
            type
        }
        ... on TimedFeeCollectModuleSettings {
            type
            amount {
            asset {
                ...Erc20Fields
            }
            value
            }
            recipient
            referralFee
            endTimestamp
        }
        ... on UnknownCollectModuleSettings {
            type
            contractAddress
            collectModuleReturnData
        }
        }

        fragment ReferenceModuleFields on ReferenceModule {
        ... on FollowOnlyReferenceModuleSettings {
            type
            contractAddress
        }
        ... on UnknownReferenceModuleSettings {
            type
            contractAddress
            referenceModuleReturnData
        }
        ... on DegreesOfSeparationReferenceModuleSettings {
            type
            contractAddress
            commentsRestricted
            mirrorsRestricted
            degreesOfSeparation
        }
    }
`

export const listPublicationByUser = gql`query Publications ($id: ProfileId!) {
    publications(request: {
      profileId: $id,
      publicationTypes: [POST, COMMENT, MIRROR],
      limit: 10
    }) {
      items {
        __typename 
        ... on Post {
          ...PostFields
        }
        ... on Comment {
          ...CommentFields
        }
        ... on Mirror {
          ...MirrorFields
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
  
  fragment MediaFields on Media {
    url
    mimeType
  }
  
  fragment ProfileFields on Profile {
    id
    name
    bio
    attributes {
       displayType
       traitType
       key
       value
    }
    isFollowedByMe
    isFollowing(who: null)
    followNftAddress
    metadata
    isDefault
    handle
    picture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    coverPicture {
      ... on NftImage {
        contractAddress
        tokenId
        uri
        verified
      }
      ... on MediaSet {
        original {
          ...MediaFields
        }
      }
    }
    ownedBy
    dispatcher {
      address
    }
    stats {
      totalFollowers
      totalFollowing
      totalPosts
      totalComments
      totalMirrors
      totalPublications
      totalCollects
    }
    followModule {
      ...FollowModuleFields
    }
  }
  
  fragment PublicationStatsFields on PublicationStats { 
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }
  
  fragment MetadataOutputFields on MetadataOutput {
    name
    description
    content
    media {
      original {
        ...MediaFields
      }
    }
    attributes {
      displayType
      traitType
      value
    }
  }
  
  fragment Erc20Fields on Erc20 {
    name
    symbol
    decimals
    address
  }
  
  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ...ReferenceModuleFields
    }
    appId
    hidden
    reaction(request: null)
    mirrors(by: null)
    hasCollectedByMe
  }
  
  fragment MirrorBaseFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ...ReferenceModuleFields
    }
    appId
    hidden
    reaction(request: null)
    hasCollectedByMe
  }
  
  fragment MirrorFields on Mirror {
    ...MirrorBaseFields
    mirrorOf {
     ... on Post {
        ...PostFields          
     }
     ... on Comment {
        ...CommentFields          
     }
    }
  }
  
  fragment CommentBaseFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    stats {
      ...PublicationStatsFields
    }
    metadata {
      ...MetadataOutputFields
    }
    createdAt
    collectModule {
      ...CollectModuleFields
    }
    referenceModule {
      ...ReferenceModuleFields
    }
    appId
    hidden
    reaction(request: null)
    mirrors(by: null)
    hasCollectedByMe
  }
  
  fragment CommentFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
        ...MirrorBaseFields
        mirrorOf {
          ... on Post {
             ...PostFields          
          }
          ... on Comment {
             ...CommentMirrorOfFields        
          }
        }
      }
    }
  }
  
  fragment CommentMirrorOfFields on Comment {
    ...CommentBaseFields
    mainPost {
      ... on Post {
        ...PostFields
      }
      ... on Mirror {
         ...MirrorBaseFields
      }
    }
  }
  
  fragment FollowModuleFields on FollowModule {
    ... on FeeFollowModuleSettings {
      type
      amount {
        asset {
          name
          symbol
          decimals
          address
        }
        value
      }
      recipient
    }
    ... on ProfileFollowModuleSettings {
      type
      contractAddress
    }
    ... on RevertFollowModuleSettings {
      type
      contractAddress
    }
    ... on UnknownFollowModuleSettings {
      type
      contractAddress
      followModuleReturnData
    }
  }
  
  fragment CollectModuleFields on CollectModule {
    __typename
    ... on FreeCollectModuleSettings {
      type
      followerOnly
      contractAddress
    }
    ... on FeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
    }
    ... on LimitedTimedFeeCollectModuleSettings {
      type
      collectLimit
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on RevertCollectModuleSettings {
      type
    }
    ... on TimedFeeCollectModuleSettings {
      type
      amount {
        asset {
          ...Erc20Fields
        }
        value
      }
      recipient
      referralFee
      endTimestamp
    }
    ... on UnknownCollectModuleSettings {
      type
      contractAddress
      collectModuleReturnData
    }
  }
  
  fragment ReferenceModuleFields on ReferenceModule {
    ... on FollowOnlyReferenceModuleSettings {
      type
      contractAddress
    }
    ... on UnknownReferenceModuleSettings {
      type
      contractAddress
      referenceModuleReturnData
    }
    ... on DegreesOfSeparationReferenceModuleSettings {
      type
      contractAddress
      commentsRestricted
      mirrorsRestricted
      degreesOfSeparation
    }
  }
  `

export const validatePublicationMetadata = gql`query ValidatePublicationMetadata ($request: PublicationMetadataV2Input!) {
    validatePublicationMetadata(request: {
      metadatav2: $request
    }) {
      valid
      reason
    }
  }
  `

export const createPostTypedData = gql`mutation CreatePostTypedData ($profileId: ProfileId!, $contentURI: Url!) {
    createPostTypedData(request: {
      profileId: $profileId,
      contentURI: $contentURI,
      collectModule: {
        revertCollectModule: true
      },
      referenceModule: {
        followerOnlyReferenceModule: false
      }
    }) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
  `