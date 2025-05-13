import { PrismaClient, Role, User, Folder, Tag, Collection, Bookmark, Device } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  // --- Clean up existing data (optional, use with caution) ---
  console.log('Deleting existing data (if any)...');
  await prisma.folderCollaborator.deleteMany();
  await prisma.collectionCollaborator.deleteMany();
  await prisma.folderBookmark.deleteMany();
  await prisma.bookmarkTag.deleteMany();
  await prisma.bookmarkCollection.deleteMany();
  await prisma.device.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.folder.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.user.deleteMany();
  console.log('Finished deleting existing data.');

  // --- Create Users (at least 10) ---
  const users: User[] = [];
  for (let i = 1; i <= 10; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const username = faker.internet.username({ firstName, lastName }).toLowerCase();
    const email = faker.internet.email({ firstName, lastName });
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user: User = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
        isVerified: faker.datatype.boolean(0.9), // 90% are verified
        isActive: faker.datatype.boolean(0.95), // 95% are active
      },
    });
    users.push(user);
    console.log(`Created user: ${user.username}`);
  }

  // --- Create Folders (at least 10 per user, including nesting) ---
  const folders: Folder[] = [];
  const folderIcons = ['📁', '📂', '🗂️', '📔', '📕', '📗', '📘', '📙', '📚', '📓', '📒', '📝'];
  
  for (const user of users) {
    let parentFolderId: string | null = null;
    
    // Create main folders
    for (let i = 1; i <= 6; i++) {
      const folderName = faker.word.words({ count: { min: 1, max: 3 } });
      const folder: Folder = await prisma.folder.create({
        data: {
          name: folderName,
          userId: user.id,
          icon: faker.helpers.arrayElement(folderIcons),
          color: faker.color.rgb(),
          parentId: null,
        },
      });
      folders.push(folder);
      console.log(`Created folder: ${folder.name} for user ${user.username}`);
      
      // Create nested folders (2-3 per main folder)
      const nestedFolderCount = faker.number.int({ min: 2, max: 3 });
      for (let j = 1; j <= nestedFolderCount; j++) {
        const nestedFolderName = faker.word.words({ count: { min: 1, max: 3 } });
        const nestedFolder: Folder = await prisma.folder.create({
          data: {
            name: nestedFolderName,
            userId: user.id,
            icon: faker.helpers.arrayElement(folderIcons),
            color: faker.color.rgb(),
            parentId: folder.id,
          },
        });
        folders.push(nestedFolder);
        console.log(`Created nested folder: ${nestedFolder.name} inside ${folder.name}`);
      }
    }
  }

  // --- Create Tags (at least 10 per user) ---
  const tags: Tag[] = [];
  for (const user of users) {
    const userTagNames = new Set<string>();
    for (let i = 1; i <= 10; i++) {
      let tagName: string;
      do {
        tagName = faker.helpers.arrayElement([
          faker.word.adjective(),
          faker.word.noun(),
          faker.commerce.department(),
          faker.company.buzzNoun()
        ]);
      } while (userTagNames.has(tagName));
      userTagNames.add(tagName);

      const tag = await prisma.tag.create({
        data: {
          name: tagName,
          userId: user.id,
          color: faker.color.rgb(),
        },
      });
      tags.push(tag);
      console.log(`Created tag: ${tag.name} for user ${user.username}`);
    }
  }

  // --- Create Collections (at least 10 per user) ---
  const collections: Collection[] = [];
  for (const user of users) {
    for (let i = 1; i <= 10; i++) {
      const collectionName = faker.helpers.arrayElement([
        `${faker.word.adjective()} ${faker.word.noun()}`,
        `${faker.commerce.productAdjective()} ${faker.commerce.product()}`,
        faker.commerce.department(),
        `${faker.person.jobArea()} Resources`
      ]);
      
      const collection = await prisma.collection.create({
        data: {
          name: collectionName,
          description: faker.lorem.sentence(),
          userId: user.id,
          ownerId: user.id,
          isPublic: faker.datatype.boolean(0.4), // 40% are public
        },
      });
      collections.push(collection);
      console.log(`Created collection: ${collection.name} for user ${user.username}`);
    }
  }

  // --- Create Bookmarks (at least 10 per user, linked to folders, tags, collections) ---
  const bookmarks: Bookmark[] = [];
  const domainTypes = ['com', 'org', 'net', 'io', 'co', 'dev', 'app'];
  
  for (const user of users) {
    const userFolders = folders.filter(f => f.userId === user.id);
    const userTags = tags.filter(t => t.userId === user.id);
    const userCollections = collections.filter(c => c.userId === user.id);
    
    // Create between 15-25 bookmarks per user
    const bookmarkCount = faker.number.int({ min: 15, max: 25 });
    
    for (let i = 1; i <= bookmarkCount; i++) {
      const domain = faker.internet.domainWord();
      const domainType = faker.helpers.arrayElement(domainTypes);
      const url = `https://www.${domain}.${domainType}/${faker.helpers.slugify(faker.lorem.words(3))}`;
      
      const bookmark = await prisma.bookmark.create({
        data: {
          url,
          title: faker.lorem.sentence(faker.number.int({ min: 3, max: 8 })),
          description: faker.datatype.boolean(0.7) ? faker.lorem.paragraph() : null, // 70% have description
          userId: user.id,
          favicon: `https://www.google.com/s2/favicons?domain=${domain}.${domainType}`,
          visitCount: faker.number.int({ min: 0, max: 200 }),
          createdAt: faker.date.past({ years: 1 }),
          updatedAt: faker.date.recent({ days: 30 }),
        },
      });
      bookmarks.push(bookmark);
      console.log(`Created bookmark: ${bookmark.title}`);
      
      // Link to folders (0-2 folders)
      if (userFolders.length > 0) {
        const folderCount = faker.number.int({ min: 0, max: 2 });
        const selectedFolders = faker.helpers.arrayElements(userFolders, folderCount);
        
        for (const folder of selectedFolders) {
          await prisma.folderBookmark.create({
            data: {
              folderId: folder.id,
              bookmarkId: bookmark.id,
            },
          });
        }
      }
      
      // Link to tags (0-3 tags)
      if (userTags.length > 0) {
        const tagCount = faker.number.int({ min: 0, max: 3 });
        const selectedTags = faker.helpers.arrayElements(userTags, tagCount);
        
        for (const tag of selectedTags) {
          await prisma.bookmarkTag.create({
            data: {
              tagId: tag.id,
              bookmarkId: bookmark.id,
            },
          });
        }
      }
      
      // Link to collections (0-2 collections)
      if (userCollections.length > 0) {
        const collectionCount = faker.number.int({ min: 0, max: 2 });
        const selectedCollections = faker.helpers.arrayElements(userCollections, collectionCount);
        
        for (const collection of selectedCollections) {
          await prisma.bookmarkCollection.create({
            data: {
              collectionId: collection.id,
              bookmarkId: bookmark.id,
              order: faker.number.int({ min: 1, max: 100 }),
            },
          });
        }
      }
    }
  }

  // --- Create Devices (a few per user) ---
  const devices: Device[] = [];
  const deviceTypes = ['Desktop', 'Laptop', 'Mobile', 'Tablet', 'Smart TV', 'Browser Extension'];
  const deviceBrands = ['Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Google', 'OnePlus', 'Xiaomi'];
  
  for (const user of users) {
    // 2-4 devices per user
    const deviceCount = faker.number.int({ min: 2, max: 4 });
    
    for (let i = 1; i <= deviceCount; i++) {
      const deviceType = faker.helpers.arrayElement(deviceTypes);
      const brand = faker.helpers.arrayElement(deviceBrands);
      const model = faker.helpers.arrayElement([
        `${brand} ${faker.number.int({ min: 5, max: 15 })}`,
        `${brand} ${faker.lorem.word()}`,
        `${brand} ${faker.commerce.productName().split(' ')[0]}`,
      ]);
      
      const device = await prisma.device.create({
        data: {
          userId: user.id,
          deviceName: `${model} ${deviceType}`,
          deviceType,
          lastSynced: faker.date.recent({ days: 14 }),
          lastActive: faker.date.recent({ days: 7 }),
        }
      });
      devices.push(device);
      console.log(`Created device: ${device.deviceName} for user ${user.username}`);
    }
  }

  // --- Add Collaborators ---
  // Add random collaborators to folders
  for (let i = 0; i < 10; i++) {
    const folder = faker.helpers.arrayElement(folders);
    const potentialCollaborators = users.filter(u => u.id !== folder.userId);
    
    if (potentialCollaborators.length > 0) {
      const collaborator = faker.helpers.arrayElement(potentialCollaborators);
      
      // Check if this collaboration already exists
      const existingCollaboration = await prisma.folderCollaborator.findFirst({
        where: {
          folderId: folder.id,
          userId: collaborator.id,
        },
      });
      
      if (!existingCollaboration) {
        await prisma.folderCollaborator.create({
          data: {
            folderId: folder.id,
            userId: collaborator.id,
            permission: faker.helpers.arrayElement([Role.VIEW, Role.EDIT]),
          },
        });
        
        const folderOwner = users.find(u => u.id === folder.userId);
        console.log(`Added user ${collaborator.username} as collaborator to folder ${folder.name} owned by ${folderOwner?.username}`);
      }
    }
  }
  
  // Add random collaborators to collections
  for (let i = 0; i < 15; i++) {
    const collection = faker.helpers.arrayElement(collections);
    const potentialCollaborators = users.filter(u => u.id !== collection.userId);
    
    if (potentialCollaborators.length > 0) {
      const collaborator = faker.helpers.arrayElement(potentialCollaborators);
      
      // Check if this collaboration already exists
      const existingCollaboration = await prisma.collectionCollaborator.findFirst({
        where: {
          collectionId: collection.id,
          userId: collaborator.id,
        },
      });
      
      if (!existingCollaboration) {
        await prisma.collectionCollaborator.create({
          data: {
            collectionId: collection.id,
            userId: collaborator.id,
            permission: faker.helpers.arrayElement([Role.VIEW, Role.EDIT]),
          },
        });
        
        const collectionOwner = users.find(u => u.id === collection.userId);
        console.log(`Added user ${collaborator.username} as collaborator to collection ${collection.name} owned by ${collectionOwner?.username}`);
      }
    }
  }

  console.log(`Seeding finished. Created:`);
  console.log(`- ${users.length} users`);
  console.log(`- ${folders.length} folders`);
  console.log(`- ${tags.length} tags`);
  console.log(`- ${collections.length} collections`);
  console.log(`- ${bookmarks.length} bookmarks`);
  console.log(`- ${devices.length} devices`);
}

main()
  .catch(async (e) => {
    console.error('Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  });
